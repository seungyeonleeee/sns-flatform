// 67 createRoute 복사해오기 (겹치는 부분 정리)
import React, { useState } from "react";
// 70 Link
import { useNavigate, Link } from "react-router-dom";
// 68
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
// 74
import {
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
  Error,
} from "../components/auth-components";
// 77
import GithubBtn from "../components/GithubBtn";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || email === "" || password === "") return;

    try {
      setIsLoading(true);

      // 69
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (e) {
      setIsLoading(true);

      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Login 🎪</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={onChange}
          value={email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={onChange}
          value={password}
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Login"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      {/* // 71 */}
      <Switcher>
        Don't you have an account?
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      {/* // 78 */}
      <GithubBtn />
    </Wrapper>
  );
};

export default Login;
