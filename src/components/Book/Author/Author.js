import "./Author.css";

const Author = ({ name, email }) => {
  return (
    <div className="authorContainer">
      Author Details:
      <div>Author Name: {name} </div>
      <div>Author email: {email} </div>
    </div>
  );
};

export default Author;
