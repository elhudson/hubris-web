import { css } from "@emotion/react";
import { Link } from "@interface/components";
export default ({ text }) => {
  return (
    <article>
      {text.map((t) => (
        <Chunk {...t} />
      ))}
    </article>
  );
};

const Chunk = ({ plaintext, link = null }) => {
  return (
    <span>
      {link ? (
        <Link
          feature={{ id: link.id, title: link.title }}
          table={link.src}
        />
      ) : (
        plaintext
      )}
    </span>
  );
};
