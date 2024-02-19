import { useAsync } from "react-async-hook";
import Link from "@components/link";
import TurndownService from "turndown";
import Markdown from "react-markdown";

const turndowner=new TurndownService()

export default ({ text }) => {
  const mentionRegex = /\[\[.+?]]/g;
  const mentions = text.match(mentionRegex)?.map((ment) => ({
    input: ment,
    name: ment.match(/(?<=\[\[).*(?=\|)/)[0],
    id: ment.match(/(?<=\|).*(?=]])/)[0]
  }));
  mentions?.forEach((mention)=> {
    text=text.replace(mention.input, Reference(mention))
  })
  return (
    <Markdown>
      {turndowner.turndown(text)}
    </Markdown>
  );
};

const Reference = ({ name, id }) => {
  const table = useAsync(
    async () => await fetch(`/data/table?id=${id}`).then((res) => res.text())
  ).result
  return (
    `<a href="/srd/${table}/${id}">${name}</a>`
  );
};
