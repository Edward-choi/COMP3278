import React from "react";
import { Layout } from "@/components/business/Layout";
import { useState } from "react";
import { Title } from "@/components/elements/Title";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";

function SignIn() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSignIn, setIsSignIn] = useState(false);

  // callback
  const handleSubmit = (e) => {
    e.preventDefault();
    window.alert("Trying to login...");

    const validateResult = validate();
    setFormErrors(validateResult.errors);
    setIsSignIn(validateResult.success);
  };

  const validate = () => {
    const result = {
      success: true,
      errors: {},
    };

    // // Check if only space(s) were entered
    // if (!inputEmail.val().trim().length || !inputPassword.val().trim().length) {
    //   result.success = false;
    //   result.errors.onlyspaces = "Invalid input with only whitespace(s)"
    // }

    // validate email
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(inputEmail.toLowerCase())) {
      result.success = false;
      result.errors.email = "Invalid email";
    }

    // validate password
    if (inputPassword.length < 8) {
      result.success = false;
      result.errors.password = "Invalid password";
    }
    return result;
  };

  const [activeTab, setActiveTab] = useState("sign-in");
  function switchTab(switchTo) {
    switch (switchTo) {
      case "sign-in":
        setActiveTab("sign-in");
        break;
      case "sign-up":
        setActiveTab("sign-up");
    }
  }

  return (
    <Layout title="Sign In / Sign up">
      <section className="section">
        <div className="column is-desktop is-two-thirds is-offset-2">
          <div className="container ">
            {Object.keys(formErrors).length === 0 && isSignIn ? (
              <div>You are logged-in.</div>
            ) : (
              <div></div>
            )}
            <Title>
              Schedule your next lesson or access previous lesson materials.
            </Title>
            <form onSubmit={handleSubmit}>
              <div className="tabs is-boxed full-width is-large">
                <ul>
                  <li
                    id="signInTab"
                    className={activeTab === "sign-in" && "is-active"}
                    onClick={() => switchTab("sign-in")}
                  >
                    <a>Sign-in</a>
                  </li>
                  <li
                    id="signUpTab"
                    className={activeTab === "sign-up" && "is-active"}
                    onClick={() => switchTab("sign-up")}
                  >
                    <a>Sign-up</a>
                  </li>
                </ul>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                  />
                </div>
                <p>{formErrors.email}</p>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                  />
                </div>
                <p>{formErrors.password}</p>
              </div>
              <div className="buttons">
                <Button
                  tabIndex="0"
                  rounded
                  disabled={!inputEmail || !inputPassword}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default SignIn;
