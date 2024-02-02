import { useCharacter } from "@contexts/character";
import Upload from "@ui/upload";

export default ({ id = null, sz = 100 }) => {
  const { character } = useCharacter();
  const endpt = `/data/character/avatar?id=${character.id}`;
  const url = id
    ? `/portraits/${id}.png`
    : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Ffd%2F8c%2F75%2Ffd8c754d06e4e4799669ae3d13daf276.jpg&f=1&nofb=1&ipt=00669a87519e5052099232ee43c280f88c22f7ddccda6dea23bf7affeb1b97eb&ipo=images";
  return(
    <Upload endpoint={endpt} path={url} sz={100}/>
  )
};
