export default (data) => {
  return {
    name: data.name,
    description: data.description,
    settings: {
      connect: data.settings.map((s) => ({ id: s.id }))
    },
    creator: {
      connect: {
        id: data.creator.id
      }
    },
    dm: {
      connect: {
        id: data.dm.id
      }
    }
  };
};
