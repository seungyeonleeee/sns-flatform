// 129, // 154 useState
import React, { useState } from "react";
// 135
import styled from "styled-components";
// 133
import { IPost } from "./TimeLine";
// 149
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  ref,
  getDownloadURL,
  StorageError,
  StorageErrorCode,
  // 158
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

// 137
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  padding: 20px;
`;
const Column = styled.div``;
const Photo = styled.img`
  width: 200px;
  height: 100%;
  border-radius: 15px;
`;
const Video = styled.video`
  width: 100px;
  height: 100%;
  border-radius: 15px;
`;
const Username = styled.span`
  font-size: 15px;
  font-weight: 600;
`;
const Payload = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;
// 147
const DeleteButton = styled.button`
  background: #ff6347;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`;
// 160
const EditorColumns = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const EditButton = styled.button`
  background: #7f8689;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`;
const EditPostFormTextArea = styled.textarea`
  background: #000;
  color: #fff;
  width: 94%;
  height: 50%;
  padding: 10px;
  margin: 10px 0 20px;
  font-size: 16px;
  border-radius: 10px;
  resize: none;
  &::placeholder {
    opacity: 1;
    transition: opacity 0.3s;
  }
  &:focus {
    outline: none;
    border: 1px solid #1d9bf0;
    &::placeholder {
      opacity: 0;
    }
  }
`;
const CancelButton = styled.button`
  background: #7f8689;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`;
const UpdateButton = styled.button`
  background: #1d9bf0;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`;
const SetContentButton = styled.label`
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1d9bf0;
  }
  svg {
    width: 24px;
  }
`;
const SetContentInput = styled.input`
  display: none;
`;

const Post = ({ username, post, photo, video, userId, id }: IPost) => {
  // 132
  // console.log(props);

  // 154 Edit 기능
  const [isEditing, setIsEditing] = useState(false); // 현재 편집중인지 아닌지
  const [editedPost, setEditedPost] = useState(post); // 글 수정
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null); // 이미지 수정

  // 156 수정사항 제어 함수
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPost(e.target.value);
  };

  // 157 수정하지 않을 경우
  const handleCancel = () => {
    setIsEditing(false);
  };

  // 155 수정을 하기 위한 기능 함수
  const handleEdit = async () => {
    setIsEditing(true);
  };

  // 164
  const onClickSetContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 166
    // console.log(e.target.files);
    const { files } = e.target;
    if (files && files.length === 1) setEditedPhoto(files[0]);
  };

  // 150 글을 쓴 사람이 맞는지 확인
  const user = auth.currentUser;

  // 152 삭제버튼 기능
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, `contents`, id));
      // storage도 지워주기
      if (photo) {
        const photoRef = ref(storage, `contents/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

  // 159
  const onUpdate = async () => {
    // 165
    try {
      if (user?.uid !== userId) return;

      // 167
      const postDoc = await getDoc(doc(db, "contents", id));
      if (!postDoc.exists()) throw new Error("Document does not exist");
      const postData = postDoc.data();

      if (postData) {
        if (postData.photo) postData.fileType = "image";
        if (postData.video) postData.fileType = "video";
      }

      const exsitingFileType = postData?.fileType || null;

      if (editedPhoto) {
        const newFileType = editedPhoto.type.startsWith("image/")
          ? "image"
          : "video";
        if (exsitingFileType && exsitingFileType !== newFileType) {
          alert("You can only upload the same type of contents");
          return;
        }

        const locationRef = ref(storage, `contents/${user.uid}/${id}`);
        const uploadTask = uploadBytesResumable(locationRef, editedPhoto);
        if (editedPhoto.size >= 7 * 1024 * 1024) {
          uploadTask.cancel();
          throw new StorageError(
            StorageErrorCode.CANCELED,
            "File size is over 5MB"
          );
        }
        const result = await uploadBytes(locationRef, editedPhoto);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, `contents`, id), {
          post: editedPost,
          photo: newFileType === "image" ? url : "",
          video: newFileType === "video" ? url : "",
          fileType: newFileType,
        });
      } else {
        await updateDoc(doc(db, "contents", id), { post: editedPost });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    // 136
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {/* // 163 */}
        {isEditing ? (
          <EditPostFormTextArea
            onChange={onChange}
            value={editedPost}
            placeholder={post}
          ></EditPostFormTextArea>
        ) : (
          <Payload>{post}</Payload>
        )}
        {/* // 148 삭제버튼 UI */}
        {/* <DeleteButton>Delete</DeleteButton> */}
        {/* // 161 */}
        <EditorColumns>
          {/* // 151 */}
          {user?.uid === userId ? (
            // 162
            <>
              {isEditing ? (
                <>
                  <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                  <UpdateButton onClick={onUpdate}>Update</UpdateButton>
                  <SetContentButton htmlFor="edit-content">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <SetContentInput
                      id="edit-content"
                      type="file"
                      accept="video/*, image/*"
                      onChange={onClickSetContent}
                    />
                  </SetContentButton>
                </>
              ) : (
                <EditButton onClick={handleEdit}>Edit</EditButton>
              )}

              <DeleteButton
                // 153 삭제버튼 완료
                onClick={onDelete}
              >
                Delete
              </DeleteButton>
            </>
          ) : null}
          {/* null : DOM 안에서 없앤다 */}
        </EditorColumns>
      </Column>
      {/* // 139 */}
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
      {video ? (
        <Column>
          <Video src={video} />
        </Column>
      ) : null}
    </Wrapper>
  );
};

export default Post;
