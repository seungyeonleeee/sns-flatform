// 94 폼 가지고 오기 (리팩토링)
import { addDoc, collection, updateDoc } from "firebase/firestore";
// 93
import React, { useState } from "react";
// 91
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 250px;
  background: #000;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 20px;
  padding: 20px;
  font-size: 16px;
  resize: none;
  &::placeholder {
    font-size: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    opacity: 1;
    transition: opacity 0.3s;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf9;
    &::placeholder {
      opacity: 0;
    }
  }
`;
const AttachFileButton = styled.label`
  width: 100%;
  color: #1d9bf9;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #1d9bf9;
  border-radius: 20px;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    border: 1px solid transparent;
    background: #1d9bf9;
    color: #fff;
  }
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background: #fff;
  color: #1d9bf9;
  border: none;
  border-radius: 20px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const PostForm = () => {
  // 95
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null); // 어떠한 값이 들어올지 모르고 최초에는 아무것도 있으면 안됨 , TS에서 or는 | 1개

  // 111 최대 용량 제한
  const maxFileSize = 7 * 1024 * 1024; // 7메가 - 데이터 단위 참고

  // 97
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // console.log(e);
    setPost(e.target.value);
  };

  // 100
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files);
    const { files } = e.target;
    // console.log(files);
    if (files && files.length === 1) {
      // 112
      if (files[0].size > maxFileSize) {
        alert("The Maximum Capacity that can be uploaded is 5MB");
        return;
      }
      setFile(files[0]);
    }

    // 파일이 있고 1개 이상 선택되었을 때
  };

  // 107 firebase 컬렉션에 값을 보내주는 함수
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || post === "" || post.length > 180) return;
    try {
      setIsLoading(true);
      // 110 변수에 담기
      const doc = await addDoc(collection(db, "contents"), {
        post,
        createdAt: Date.now(),
        username: user?.displayName || "Anonymous",
        userId: user.uid,
      });
      // 109
      if (file) {
        // ref() : 파이어베이스 안에 넣을 구조를 찾아와주는 함수
        const locationRef = ref(storage, `contents/${user.uid}/${doc.id}`);
        // uploadBytes() : storage에 업데이트 해주는 함수
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);

        // 138 파일 타입 체크
        const fileType = file.type;
        if (fileType.startsWith("image/")) {
          // startsWith : 어떠한 문자로 시작하는지 체크
          await updateDoc(doc, {
            photo: url,
          });
        }
        if (fileType.startsWith("video/")) {
          await updateDoc(doc, {
            video: url,
          });
        }
      }
      // 110 업로드 하면 리셋해주기
      setPost("");
      setFile(null);
    } catch (e) {
      console.error(e); // 이게 정석
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 92
    <Form
      // 106
      onSubmit={onSubmit}
    >
      <TextArea
        name="contents"
        id="contents"
        placeholder="What is Happening?"
        // 96
        onChange={onChange}
        // 99
        value={post}
        // 108
        required
      ></TextArea>
      <AttachFileButton htmlFor="file">
        {file ? "Contents Added ✔" : "Add ➕"}
      </AttachFileButton>
      <AttachFileInput
        type="file"
        id="file"
        accept="video/*, image/*"
        // 101
        onChange={onFileChange}
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post"} />
    </Form>
  );
};

export default PostForm;
