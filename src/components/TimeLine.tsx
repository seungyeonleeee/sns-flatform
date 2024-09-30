// 113, // 116 useState, // 121 useEffect
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
// 118
import styled from "styled-components";
import { db } from "../firebase";
// 130
import Post from "./Post";

// 115 firebase에 있는 정보를 출력하기 전 타입 정의
// interface : 객체의 타입을 정의한다
export interface IPost {
  // 126 컨텐츠 삭제 시 우리가 제어할 수 있는 id 필요 (userId는 firebase)
  id: string;
  // 115
  createdAt: number;
  photo?: string;
  video?: string;
  post: string;
  userId: string;
  username: string;
}
// 134
// photo? => 옵션 (필수값X)

// 119
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  padding: 0 10px;
`;

const TimeLine = () => {
  // 117
  const [posts, setPosts] = useState<IPost[]>([]);
  // <IPost[]> : 배열의 타입을 정의하는데 그 배열이 IPost형태로 들어올거다
  // 123  실제로 값을 찾아와주는 함수
  // const fetchPosts = async () => {
  //   // 125
  //   const postsQuery = query(
  //     collection(db, "contents"),
  //     orderBy("createdAt", "desc")
  //     // orderBy : (desc)내림차순 정렬
  //   );
  //   // 140 새로고침 말고 실시간으로 데이터가 업데이트 되게
  //   // const snapshot = await getDocs(postsQuery);
  //   // // snapshot.docs.forEach((doc) => console.log(doc.data()));
  //   // // docs => 배열
  //   // const posts = snapshot.docs.map((doc) => {
  //   //   const { createdAt, photo, video, post, userId, username } = doc.data();
  //   //   // 127
  //   //   return {
  //   //     id: doc.id, // 문서안의 id
  //   //     createdAt,
  //   //     photo,
  //   //     video,
  //   //     post,
  //   //     userId,
  //   //     username,
  //   //   };
  //   // });
  //   // 141 실시간 리얼 타임
  //   // 단점 : 작은 요소 하나만 변경되도 firebase 데이터가 전체 사용 소모
  //   // 143 unsubscribe 변수에 담기
  //   const unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
  //     // snapshot : 변경된 사항
  //     const posts = snapshot.docs.map((doc) => {
  //       const { createdAt, photo, video, post, userId, username } = doc.data();
  //       return {
  //         id: doc.id,
  //         createdAt,
  //         photo,
  //         video,
  //         post,
  //         userId,
  //         username,
  //       };
  //     });
  //     // 142
  //     setPosts(posts);
  //   });
  //   // 128
  //   // setPosts(posts);
  // };

  // 122 컴포넌트가 마운트가 되는 최초에 한번
  useEffect(() => {
    // 145
    let unsubscribe: Unsubscribe | null = null;
    // 144
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "contents"),
        orderBy("createdAt", "desc"),
        // 147
        limit(25)
      );
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { createdAt, photo, video, post, userId, username } =
            doc.data();
          return {
            id: doc.id,
            createdAt,
            photo,
            video,
            post,
            userId,
            username,
          };
        });
        setPosts(posts);
      });
    };
    // 124
    fetchPosts();
    // 146 언마운트가 되는 시점
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {/* // 120 배열요소 문자화 */}
      {/* {JSON.stringify(posts)} */}
      {/* // 131 */}
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Wrapper>
  );
};

export default TimeLine;
