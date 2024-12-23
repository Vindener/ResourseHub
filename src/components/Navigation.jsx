import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Календар</Link>
      <Link to="/notes" style={{ marginRight: "10px" }}>Нотатник</Link>
      <Link to="/account" style={{ marginRight: "10px" }}>Особистий кабінет</Link>
      <Link to="/tips">Поради</Link>
      <Link to="/relaxation">Відпочинок</Link>
    <Link to="/pomodoro">Помодоро</Link>

    </nav>
  );
};

export default Navigation;
