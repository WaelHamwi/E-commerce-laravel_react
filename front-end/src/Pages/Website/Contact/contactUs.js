import React from "react";
import "./contactUs.css";
import { useForm, ValidationError } from "@formspree/react";
import Lottie from "lottie-react";
import successAnimation from "../../../animation/Animation - 1717575872491.json";
import contactMe from "../../../animation/Animation - 1717580538024.json";

const Contact = () => {
  const [state, handleSubmit] = useForm("mrgnwowe");

  return (
    <section className="contact-me" id="contact-me">
      <h1 className="title">
        <span className="icon-envelope-open"></span>
        Contact Me
      </h1>
      <p className="subtitle">
        I am thrilled that you have taken the time to explore my E-commerce! If
        you have any questions, feedback, or collaboration opportunities, feel
        free to reach out. I would love to connect with you.
      </p>

      <div className="flex contact-me-sections">
        <form onSubmit={handleSubmit} action="">
          <div className="flex">
            <label htmlFor="email">Email Address:</label>
            <input required type="email" name="email" id="email" />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>
          <div className="message-part flex">
            <label htmlFor="message">Leave a Message:</label>
            <textarea required name="message" id="message"></textarea>
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </div>
          <button type="submit" disabled={state.submitting} className="submit">
            {state.submitting ? "Submitting.." : "Submit"}
          </button>

          {state.succeeded && (
            <div className="success-message">
              <div className="Lottie">
                <Lottie animationData={successAnimation} loop={false} />
              </div>
              <h2>Thanks for joining</h2>
            </div>
          )}
        </form>

        <div className="animated">
          <Lottie
            className="contactMe-animation"
            animationData={contactMe}
            loop
          />
        </div>
      </div>

      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448181.163742937!2d31.660340513491988!3d30.140785465298695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDU1JzE3LjYiTiAzMcKwNzAnNDguNCJF!5e0!3m2!1sen!2sus!4v1639491521817!5m2!1sen!2sus"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;
