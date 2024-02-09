import { useAsync } from "react-async-hook";
import Link from "@components/link";
export default ({ text }) => {
  const mentionRegex = /\[\[.+?]]/g;
  const mentions = text.match(mentionRegex)?.map((ment) => ({
    name: ment.match(/(?<=\[\[).*(?=\|)/)[0],
    id: ment.match(/(?<=\|).*(?=]])/)[0]
  }));
  const plaintext = text.split(mentionRegex);
  var parts = [];
  for (var i = 0; i < plaintext.length; i++) {
    parts[i] = {
      text: <span>{plaintext[i]}</span>,
      mention: plaintext.length > 1 && mentions[i - 1] && <Mention {...mentions[i - 1]} />
    };
  }
  return (
    <div>
      {parts.map((p) => (
        <>
        {p.mention} {p.text}
        </>
      ))}
    </div>
  );
};

const Mention = ({ name, id }) => {
  const table = useAsync(
    async () => await fetch(`/data/table?id=${id}`).then((res) => res.text())
  ).result
  return (
    <span>

      {table ? (
        <Link
          table={table}
          feature={{ title: name, id: id }}
        />
      ) : name}
    </span>
  );
};
