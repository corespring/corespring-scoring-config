# corespring-scoring-config

[![Build Status](https://travis-ci.org/PieElements/corespring-choice.svg?branch=master)](https://travis-ci.org/corespring/corespring-scoring-config)

`corespring-scoring-config` is a panel that allows for the editing of scoring properties, for use within PIE configuration panels.

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