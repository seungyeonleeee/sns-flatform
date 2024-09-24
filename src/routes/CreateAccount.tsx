// 8, // 28 useState
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components";
// 42
import { auth } from "../firebase";

// 27
const Wrapper = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 50px 0;
`;
const Title = styled.h1`
  font-size: 42px;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    transition: opacity 0.3s;
    &:hover {
      opacity: 0.8;
    }
  }
`;
const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

const CreateAccount = () => {
  // 36 로딩시간 제어
  const [isLoading, setIsLoading] = useState(false);
  // 38 에러 상태관리
  const [error, setError] = useState("");
  // 29
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      // 41 - 순차적으로 실행 await
      await createUserWithEmailAndPassword(
        // 43
        auth,
        email,
        password
      );
      // createUserWithEmailAndPassword : 사용자에게 값을 받아서 생성
    } catch (e) {
      // setError()
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
