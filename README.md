# corespring-scoring-config

`corespring-scoring-config` is a panel that allows for the editing of scoring properties, for use within PIE configuration panels. It is very much a work in progress.

## Usage

### Install

    npm install --save corespring-scoring-config


### Import

    import PartialScoringConfig from 'corespring-scoring-config/src/index.jsx';


### Element

    <PartialScoringConfig 
      numberOfCorrectResponses={this._sumCorrectAnswers()}
      partialScoring={this.props.model.partialScoring}
      onPartialScoringChange={this.onPartialScoringChange.bind(this)} />