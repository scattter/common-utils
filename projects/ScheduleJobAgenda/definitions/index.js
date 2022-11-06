const { mrListenDefinition } =  require("./mrListen.definition");

const definitions = [mrListenDefinition];

const allDefinitions = (agenda) => {
  definitions.forEach((definition) => definition(agenda));
};

module.exports = { allDefinitions }