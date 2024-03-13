import { css } from "@emotion/react";

export default ({ text }) => {
  const mentionRegex = /\[\[.+?]]/g;
  const mentions = text.match(mentionRegex)?.map((ment) => ({
    input: ment,
    title: ment.match(/(?<=\[\[).*(?=\|)/)[0],
    id: ment.match(/(?<=\|).*(?=]])/)[0],
  }));
  mentions &&
    mentions.forEach((mention) => {
      text = text.replace(mention.input, mention.title);
    });
  return (
    <article
      css={css`
        p {
          margin-top: 0px;
          &:last-child {
            margin-bottom: 0px;
          }
        }
        table,
        th,
        td {
          border-collapse: collapse;
        }
      `}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
