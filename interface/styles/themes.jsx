var splitPath = function (path) {
  var result = path
    .replace(/\\/g, "/")
    .match(/(.*\/)?(\..*?|.*?)(\.[^.]*?)?(#.*$|\?.*$|$)/);
  return {
    dirname: result[1] || "",
    filename: result[2] || "",
    extension: result[3] || "",
    params: result[4] || ""
  };
};

export default Object.fromEntries(
  Object.entries(
    import.meta.glob("./themes/*.json", {
      import: "default",
      eager: true
    })
  ).map((th) => [splitPath(th[0]).filename, th[1]])
);
