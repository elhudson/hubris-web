import { useAsync } from "react-async-hook";
import Link from "@components/link";
import { css, useTheme } from "@emotion/react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

export default ({ text }) => {
  const { colors, palette } = useTheme();
  const mentionRegex = /\[\[.+?]]/g;
  const mentions = text.match(mentionRegex)?.map((ment) => ({
    input: ment,
    title: ment.match(/(?<=\[\[).*(?=\|)/)[0],
    id: ment.match(/(?<=\|).*(?=]])/)[0]
  }));
  const tables = useAsync(async () => {
    if (mentions) {
      for (var mention of mentions) {
        const table = await fetch(`/data/table?id=${mention.id}`).then((res) =>
          res.text()
        );
        text = text.replace(
          mention.input,
          `<a href="/srd/${table}/${mention.id}">${mention.title}</a>`
        );
      }
    }
    return text;
  }).result;
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
      dangerouslySetInnerHTML={{ __html: tables }}
    />
  );
};
