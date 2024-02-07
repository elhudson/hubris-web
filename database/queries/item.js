export default (data) => {
  return {
    ...data,
    damage_types: {
      connect: Array.isArray(data.damage_types)
        ? data.damage_types.map((d) => ({ id: d.id }))
        : {
            id: data.damage_types.id
          }
    }
  };
};
