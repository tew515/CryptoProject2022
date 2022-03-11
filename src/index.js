import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import Home from "./pages/home";
import History from "./pages/history";
import ExchangeRates from "./pages/exchangeRates";
import './index.css';

export default function App() {
  return (
    <>
      <Router> 
        <div className="routing">        
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup className="me-2" aria-label="First group">
              <Link to="/"><Button variant="primary">Logo</Button></Link>
              <Link to="/"><Button variant="primary">Home</Button></Link>
              <Link to="/history"><Button variant="primary">History</Button></Link>
              <Link to="/exchangeRates"><Button variant="primary">ExchangeRates</Button></Link>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/history">
              <History />
            </Route>
            <Route path="/exchangeRates">
              <ExchangeRates />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
    
  );
}

ReactDOM.render(<App />, document.getElementById("root"));