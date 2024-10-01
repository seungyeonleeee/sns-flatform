// 5, // 171 useState, // 178 useEffect
import React, { useState, useEffect } from "react";
// 168
import styled from "styled-components";
// 176 storage , ref, // 179 db
import { auth, storage, db } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
// 182
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
// 180
import { IPost } from "../components/TimeLine";
// 181
import Post from "../components/Post";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1d9df0;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
// 183
const Posts = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
// 187
const ChangeNameButton = styled.button`
  background: #3b3a3a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
`;
const NameInput = styled.input`
  background: #000;
  color: #fff;
  border: none;
  border-bottom: 1px solid #fff;
  padding: 8px 10px;
  font-size: 18px;
  text-align: center;
  &:focus {
    outline: none;
  }
`;

const Profile = () => {
  // 169
  const user = auth.currentUser;

  // 172
  const [avatar, setAvatar] = useState(user?.photoURL || null || undefined);
  // user?.photoURL => 문자열

  // 184
  const [posts, setPosts] = useState<IPost[]>([]);

  // 188
  const [name, setName] = useState(user?.displayName ?? "Anonymous");

  // 189
  const [editMode, setEditMode] = useState(false);

  // 175
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files);
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      // 177
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      // ref() : 저장될 주소 정의
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  // 193
  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // 191
  const onChangeNameBtn = async () => {
    if (!user) return;
    setEditMode((prev) => !prev); // toggle 기능
    if (!editMode) return;

    try {
      await updateProfile(user, {
        displayName: name,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setEditMode(false);
    }
  };

  // 185
  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, "contents"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => {
      const { createdAt, photo, video, post, userId, username } = doc.data();
      return {
        createdAt,
        photo,
        video,
        post,
        userId,
        username,
        id: doc.id,
      };
    });
    setPosts(posts);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {/* // 173 */}
        {Boolean(avatar) ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        // 174
        onChange={onAvatarChange}
      />
      {/* // 170 */}
      {/* <Name>{user?.displayName ?? "Anonymous"}</Name> */}
      {/* // 190 */}
      {editMode ? (
        <NameInput
          onChange={onChangeNameInput}
          // 192
          value={name}
        />
      ) : (
        <Name>{user?.displayName ?? "Anonymous"}</Name>
      )}
      <ChangeNameButton onClick={onChangeNameBtn}>
        {editMode ? "Save" : "New"}
      </ChangeNameButton>

      {/* // 186 */}
      <Posts>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </Posts>
    </Wrapper>
  );
};

export default Profile;
