import React from 'react';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { CardHeader } from 'material-ui/Card';
import _ from 'lodash'; 

describe('MultiPartialScoringConfig', () => {

  const muiTheme = getMuiTheme();
  const shallowWithContext = node => shallow(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: React.PropTypes.object }
  });

  let index = proxyquire('../src/multi-partial-scoring-config.jsx', {
    './scoring-config-row': proxyquire('../src/scoring-config-row.jsx', {
      './scoring-config.less': {
        '@noCallThru': true
      }
    })
  });

  let MultiPartialScoringConfig = index.default;

  let component;

  let _rows = [ 
    { "id" : "row-1", "labelHtml" : "Row 1" }, 
    { "id" : "row-2", "labelHtml" : "Row 2" }, 
    { "id" : "row-3", "labelHtml" : "Row 3" }
  ];

  let buildComponent = ({ partialScoring, onPartialScoringChange, rows, correctResponse } = {rows: _rows, correctResponse: []}) => {
    component = shallowWithContext(<MultiPartialScoringConfig
      rows={rows}
      correctResponse={correctResponse}
      partialScoring={partialScoring}
      onPartialScoringChange={onPartialScoringChange}
    />);
  };

  beforeEach(() => {
    buildComponent();
  });

  it('renders header text', () => {
    expect(component.find('.scoring-header-text')).to.have.length(1);
  });

  describe('CardHeader showExpandableButton', () => {
    
    it('should be false', () => {
      expect(component.find(CardHeader).first().props().showExpandableButton).to.eql(false);
    });

    describe('when there is a row with > 1 correct answer', () => {
      let correctResponse = [
        { "id" : "row-1", "matchSet" : [ true, true, false ] }, 
        { "id" : "row-2", "matchSet" : [ false, true, false ] }, 
        { "id" : "row-3", "matchSet" : [ true, false, false ] }
      ];
      
      beforeEach(() => {
        buildComponent({ rows: _rows, correctResponse: correctResponse })
      })
      
      it('should be true', () => {
        expect(component.find(CardHeader).first().props().showExpandableButton).to.eql(true);
      });
    });

  });

  describe('rows', () => {
    let cols = 3;
    let rowCounts = {'row-1': 1, 'row-2': 2, 'row-3': 3};
    let correctResponse = (rowCounts) => Object.entries(rowCounts).map(([ id, correct ]) => {
      return { id: id, matchSet: _.times(cols, (index) => index < correct) };
    });

    beforeEach(() => {
      buildComponent({ rows: _rows, correctResponse: correctResponse(rowCounts)});
    });

    it('display rows with correct response count > 1', () => {
      let toDisplay = Object.entries(rowCounts).filter(([id, correct]) => correct > 1).map(([id, correct]) => id);
      toDisplay.forEach((rowId) => expect(component.find(`.row.row-${rowId}`).length).to.eql(1));
    });

    it('does not display rows with correct resposne count <= 1', () => {
      let toNotDisplay = Object.entries(rowCounts).filter(([id, correct]) => correct <= 1).map(([id, correct]) => id);
      toNotDisplay.forEach((rowId) => expect(component.find(`.row.row-${rowId}`).length).to.eql(0));
    });

    it('displays all the things yo', () => {
      component.find('.row').forEach((row) => {
        let rowId = /.*(row-.*)/.exec(row.prop('className'))[1];
        let expectedHtml = _rows.find(({id}) => id === rowId).labelHtml;
        expect(row.find('.row-label').html()).to.include(expectedHtml);
      });
    });

    describe('ScoringRowConfig', () => {

      it('has number of correct for each row', () => {
        component.find('.row').forEach((row) => {
          let rowId = /.*(row-.*)/.exec(row.prop('className'))[1];
          expect(row.find('ScoringConfigRow').first().props().numberOfCorrectResponses).to.eql(rowCounts[rowId]);
        });
      });

    });

  });

});