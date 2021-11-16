import Background from "./Background";

const Home = (props) => {
  const { height, width } = props;
  return (
    <>
      <Background height={height} width={width} />
    </>
  );
};

export default Home;
