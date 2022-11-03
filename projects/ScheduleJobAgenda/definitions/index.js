const { pipelineDefinition } =  require("./pipeline.definition");

const definitions = [pipelineDefinition];

const allDefinitions = (agenda) => {
  definitions.forEach((definition) => definition(agenda));
};

module.exports = { allDefinitions }