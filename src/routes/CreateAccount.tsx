// 8, // 28 useState
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
// 47
import { useNavigate } from "react-router-dom";
// 42
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
// 75
import {
  Form,
  Input,
  Title,
  Wrapper,
  Error,
} from "../components/auth-components";

const CreateAccount = () => {
  // 36 로딩시간 제어
  const [isLoading, setIsLoading] = useState(false);
  // 38 에러 상태관리
  const [error, setError] = useState("");
  // 29
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 48
  const navigate = useNavigate();

  // 31 TS문법 매개변수 타입 정해줘야 함
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // React.ChangeEvent<HTMLInputElement> : <> 제네릭형식
    // console.log(e);
    // e객체 중첩구조분해할당
    const {
      target: { name, value },
    } = e;

    // 32
    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // 35
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(name, email, password);

    // 44 예외조항처리
    if (isLoading || name === "" || email === "" || password === "") return;

    // 39
    try {
      // create an account
      // set the name of the user
      // redirect to the home page
      setIsLoading(true);
      // 50

      // 41 - 순차적으로 실행 await, // 45 변수에 담기
      const credentials = await createUserWithEmailAndPassword(
        // 43
        auth,
        email,
        password
      );
      // createUserWithEmailAndPassword : 사용자에게 값을 받아서 생성

      // 46 updateProfile : 로그인 정보를 db에 업데이트 해주는 함수
      await updateProfile(credentials.user, {
        displayName: name,
      });

      // 49
      navigate("/");
    } catch (e) {
      setIsLoading(true);
      // setError()

      // 64 중복 이메일 넣어보기
      // console.log(e);

      // 65 에러객체 타입 정의
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false); // try, catch 상관없이 로딩상태는 무조건 끝나게
    }
  };

  return (
    // 26
    // form 요소 UI 만들기
    // required : 필수값
    <Wrapper>
      <Title>Log into 🎃</Title>
      <Form
        // 34
        onSubmit={onSubmit}
      >
        <Input
          name="name"
          type="text"
          placeholder="Name"
          required
          // 30
          onChange={onChange}
          // 33
          value={name}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          // 30
          onChange={onChange}
          // 33
          value={email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          // 30
          onChange={onChange}
          // 33
          value={password}
        />
        <Input
          type="submit"
          // 37
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {/* // 40 */}
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
};

export default CreateAccount;
