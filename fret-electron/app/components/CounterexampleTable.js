// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

//tooltips for variables in cex table
//hover over requirement => show def. (like in CirclePacking diagram)
//hover over variable => 
//	show <kind> = [input, internal, output] : <type> [int, bool...]
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import { DiagnosisContext } from './DiagnosisProvider';

const tableComponentBarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  componentBar:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  modelRoot: {
     display: 'flex',
     flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 150,
    padding: theme.spacing(-2),
    marginRight: theme.spacing(2)

  },
});

let TableComponentBar = props => {
  const {classes, handleChange, cexConflictName, conflicts, menuItems} = props;  
  
  return(
    <Toolbar className={classNames(classes.root, classes.componentBar)}>
      <form className={classes.formControl} autoComplete="off">
        <FormControl className={classes.modelRoot}>
          <InputLabel htmlFor="component-helper">Counterexample for</InputLabel>
          <Select
            key={cexConflictName === undefined ? '' : cexConflictName}
            value={cexConflictName}
            onChange={handleChange}
            input={<Input name="component" id="component-helper" />}
          >
            {menuItems}
          </Select>
        </FormControl>
      </form>
    </Toolbar>
  );
};

TableComponentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  cexConflictName: PropTypes.string.isRequired,
  conflicts: PropTypes.array.isRequired,
  menuItems: PropTypes.array.isRequired
}

TableComponentBar = withStyles(tableComponentBarStyles)(TableComponentBar);

const styles = theme => ({
  root: {
    width: 600,
    height: 400,
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  table: {
    maxWidth: 600,
    maxHeight: 500,
    position: 'relative'
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    top: 0
  }
});

class CounterexampleTable extends React.Component {
  static contextType = DiagnosisContext;  

  state = {
  	numberOfSteps : undefined,
  	cex : undefined,
    deps : []
  };

  constructor(props) {
  	super(props);
  	this.state = { 
  		numberOfSteps : this.props.cexTableData[this.props.currentConflicts[0]].K,
		  cexConflictName : this.props.cexTableData[this.props.currentConflicts[0]].props,  		
  		cex : this.props.cexTableData[this.props.currentConflicts[0]].Counterexample,
      // deps: this.props.cexTableData[this.props.currentConflicts[0]].Dependencies
    };
  }

  handleChange = event => {
    this.setState({ 
    	numberOfSteps : this.props.cexTableData[event.target.value].K,
		  cexConflictName : this.props.cexTableData[event.target.value].props,
    	cex : this.props.cexTableData[event.target.value].Counterexample,
    	// deps : this.props.cexTableData[event.target.value].Dependencies,
      [event.target.name]: event.target.value
    })
    this.context.setMessage({
      reqs : event.target.value,
      color : this.props.colors[this.props.currentConflicts.indexOf(event.target.value)]
    });
  };

  componentDidUpdate(prevProps) {
  	if (this.props.currentConflicts !== prevProps.currentConflicts) {
  		this.setState({
  			numberOfSteps : this.props.cexTableData[this.props.currentConflicts[0]].K,
  			cexConflictName : this.props.cexTableData[this.props.currentConflicts[0]].props,
  			cex : this.props.cexTableData[this.props.currentConflicts[0]].Counterexample,
        // deps : this.props.cexTableData[this.props.currentConflicts[0]].Dependencies
  		});    
  	}

  }

  render() {
  	const {classes, allConflicts, currentConflicts, cexTableData} = this.props;
  	const {numberOfSteps, cex, cexConflictName, deps} = this.state;
  	var menuItems = [];
  	for (var i = 0; i < currentConflicts.length; i++) {
  		menuItems.push(
		(<MenuItem key={i} value={currentConflicts[i]}>
      Conflict {allConflicts.indexOf(currentConflicts[i])+1}
			</MenuItem>)
		);
  	}

  	var tableHeaders = [];
  	for (var i = 0; i < numberOfSteps; i++) {
  		tableHeaders.push(
  		(<TableCell className={classes.header} key={i} align="right"> {"Step " + i} </TableCell>)
  		);
  	}

  	var tableRows = [];
    
    //Filter out JKind local variables from cex data, then create table row for everything else
    // cex.filter(row => !locs.includes(row.name)).map...
    cex.map(row => (tableRows.push(
          <TableRow key={cex.indexOf(row)}>
            {Object.keys(row).map(function(key, index) {          
              return(<TableCell key={index} align="right"> {row[key].toString()} </TableCell>);
            })}
          </TableRow>)))
           
  	return (
  		<div>
      <Paper className={classes.root}>              
        <TableComponentBar
          handleChange={this.handleChange}
          cexConflictName={cexConflictName}
          conflicts={allConflicts}
          menuItems={menuItems}
        />
				<Table className={classes.table}>
				  <TableHead>
				    <TableRow>
				      <TableCell className={classes.header} align="right">Variable name</TableCell>
				      <TableCell className={classes.header} align="right">Variable type</TableCell>
				      {tableHeaders}
				    </TableRow>
				  </TableHead>
				  <TableBody>
				    {tableRows}
				  </TableBody>
				</Table>
			</Paper>
		</div>
  	);
  }
}

      // <FormControl>
      // <InputLabel htmlFor="component-helper">Counterexample for conflict:</InputLabel>
      // <Select
        // name={cexConflictName}
        // value={cexConflictName}
        // onChange={this.handleChange}
      // >
      // {menuItems}
      // </Select>
      // </FormControl>

CounterexampleTable.propTypes = {
  allConflicts: PropTypes.array.isRequired,  
  currentConflicts: PropTypes.array.isRequired,
  cexTableData: PropTypes.object.isRequired,
  colors: PropTypes.array.isRequired
}

export default withStyles(styles)(CounterexampleTable);
