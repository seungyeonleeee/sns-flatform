// 129, // 154 useState
import React, { useState } from "react";
// 135
import styled from "styled-components";
// 133
import { IPost } from "./TimeLine";
// 149
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  ref,
  getDownloadURL,
  StorageError,
  StorageErrorCode,
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

const Post = ({ username, post, photo, video, userId, id }: IPost) => {
  // 132
  // console.log(props);

  // 154 Edit 기능
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null);

  // 156
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPost(e.target.value);
  };

  // 157
  const handleCancel = () => {
    setIsEditing(false);
  };

  // 155
  const handleEdit = async () => {
    setIsEditing(true);
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

  return (
    // 136
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{post}</Payload>
        {/* // 148 삭제버튼 UI */}
        {/* <DeleteButton>Delete</DeleteButton> */}
        {/* // 151 */}
        {user?.uid === userId ? (
          <DeleteButton
            // 153 삭제버튼 완료
            onClick={onDelete}
          >
            Delete
          </DeleteButton>
        ) : null}
        {/* null : DOM 안에서 없앤다 */}
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
