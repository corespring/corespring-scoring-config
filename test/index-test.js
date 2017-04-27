import React from 'react';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { CardHeader } from 'material-ui/Card';

describe('PartialScoringConfig', () => {

  const muiTheme = getMuiTheme();
  const shallowWithContext = node => shallow(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: React.PropTypes.object },
  });

  let index = proxyquire('../src/index.jsx', {
    './scoring-config-row': proxyquire('../src/scoring-config-row.jsx', {
      './scoring-config.less': {
        '@noCallThru': true
      }
    })
  });

  let PartialScoringConfig = index.default;

  let component;

  let buildComponent = ({ partialScoring, numberOfCorrectResponses, onPartialScoringChange } = {}) => {
    component = shallowWithContext(<PartialScoringConfig
      partialScoring={partialScoring}
      numberOfCorrectResponses={numberOfCorrectResponses}
      onPartialScoringChange={onPartialScoringChange}
    />);
  };

  beforeEach(() => {
    buildComponent();
  });

  describe('render', () => {

    it('renders header text', () => {
      expect(component.find('.scoring-header-text')).to.have.length(1);
    });

    describe('props.numberOfCorrectResponses', () => {

      [0, 1].forEach(num => {
        describe(`value ${num}`, () => {
          beforeEach(() => {
            buildComponent({
              numberOfCorrectResponses: num
            });
          });

          it('hides expand button for panel', () => {
            expect(component.find(CardHeader).first().props().showExpandableButton).to.eql(false);
          });

        });
      });

      describe('value > 1', () => {
        beforeEach(() => {
          buildComponent({
            numberOfCorrectResponses: 2
          });
        });

        it('shows expand button for panel', () => {
          expect(component.find(CardHeader).first().props().showExpandableButton).to.eql(true);
        });

      });

    });

    describe('ScoringConfigRow', () => {
      let scoringConfigRow;
      let props = {
        numberOfCorrectResponses: 2,
        partialScoring: {
          weight: 0.2,
          numCorrect: 1
        },
        onPartialScoringChange: function() {}
      };

      beforeEach(() => {
        buildComponent(props);
        scoringConfigRow = component.find('ScoringConfigRow').first();
      });

      it('receives property numberOfCorrectResponses', () => {
        expect(scoringConfigRow.props().numberOfCorrectResponses).to.eql(props.numberOfCorrectResponses);
      });

      it('receives property partialScoring', () => {
        expect(scoringConfigRow.props().partialScoring).to.eql(props.partialScoring);
      });

    });
    
  });


});