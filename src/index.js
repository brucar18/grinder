import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { BrowserRouter as Router, Route, Link, useNavigate, Routes } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";




const NumericKeyboard = ({ onKeyPress, onOk, onDelete }) => {
  const keys = [
    { value: "7", position: { row: 1, col: 1 } },
    { value: "8", position: { row: 1, col: 2 } },
    { value: "9", position: { row: 1, col: 3 } },
    { value: "4", position: { row: 2, col: 1 } },
    { value: "5", position: { row: 2, col: 2 } },
    { value: "6", position: { row: 2, col: 3 } },
    { value: "1", position: { row: 3, col: 1 } },
    { value: "2", position: { row: 3, col: 2 } },
    { value: "3", position: { row: 3, col: 3 } },
    { value: "0", position: { row: 4, col: 1 } },
    { value: ".", position: { row: 4, col: 2 } },
    ];
  
  return (
    <div className="numeric-keyboard">
      {keys.map(({ value, position }) => (
        <button
          key={value}
          onClick={() => onKeyPress(value)}
          className={`numeric-key row-${position.row} col-${position.col}`}
        >
          {value}
        </button>
      ))}
      <button className="ok-button" onClick={onOk}>
        Izracunaj
          </button>
          <button onClick={onDelete} className="ok-button">
              Ponastavi
          </button>
    </div>
  );
};


const App = () => {
  const [inputValues, setInputValues] = useState(["", "3"]);
  const [activeInput, setActiveInput] = useState(null);
  // const [savedValues, setSavedValues] = useState(["", ""]);
  const navigate = useNavigate();

  const handleInputFocus = (index) => {
    setActiveInput(index);
  };

  const handleKeyPress = (value) => {
    if (activeInput !== null) {
      const newInputValues = [...inputValues];
      if (typeof value === "function") {
        newInputValues[activeInput] = value(newInputValues[activeInput]);
      } else {
        newInputValues[activeInput] = newInputValues[activeInput] + value;
      }
      setInputValues(newInputValues);
    }
  };
  

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleOk = () => {
    const [value1, value2] = inputValues;
    const calculationResult = {
      value1: parseFloat(value1),
      value2: parseFloat(value2),
      // value3: parseFloat(value3) * 2 - 1,
    };
    localStorage.setItem("calculationResult", JSON.stringify(calculationResult));
    navigate("/result");
    };

    const handleNumpadClick = (value) => {
                setInputValues(["","3"]
                // value3: "",
            );
        
    };

  return (
    <div className="app">
      <h1>Mletje za placilo</h1>
      {["Kolicina psenice v kg", "Procent kala v %"].map((label, index) => (
        <div key={index} className="input-container">
          <label htmlFor={`input-${index}`} className="input-label">
            {label}
          </label>
          <div className="input-wrapper">
            <input
              id={`input-${index}`}
              type="text"
              value={inputValues[index]}
              onFocus={() => handleInputFocus(index)}
              onChange={(event) => handleInputChange(event, index)}
              className="numeric-input"
            />
            
            <span className="input-unit"></span>
          </div>
          
        </div>

        
      ))}
          <NumericKeyboard onKeyPress={handleKeyPress} onOk={handleOk} onDelete={handleNumpadClick} />
    </div>
  );
};

const exportAsPDF = () => {
  const resultPage = document.querySelector(".app");
  const pdfWrapper = document.createElement("div");
  pdfWrapper.className = "pdf-wrapper";
  pdfWrapper.appendChild(resultPage.cloneNode(true));
  document.body.appendChild(pdfWrapper);
  html2canvas(pdfWrapper, { scale: 2, allowTaint: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 1);
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Izpis.pdf");
  });
};

const Result = () => {
  const [result] = useState(
    JSON.parse(localStorage.getItem("calculationResult"))
    );
    const [showTable3, setShowTable3] = useState(false);

    const handleMiddleTableClick = () => {
        setShowTable3(!showTable3);
    };
    const StehtanaKolicina = parseFloat(result.value1)
    const TruePercentage = result.value2 * 0.01
    const kalo = (StehtanaKolicina * TruePercentage).toFixed(1)
    const razlika = (StehtanaKolicina - kalo).toFixed(1)
    const belaMoka = (razlika * 0.36).toFixed(1)
    const PolBelaMoka = (razlika * 0.27).toFixed(1)
    const CrnaMoka = (razlika * 0.09).toFixed(1)
    const otrobi = (razlika * 0.28).toFixed(1)

    // izraèun razdelitve deleza Bele moke
    const delezPolnozrnate_1 = (belaMoka * 0.36).toFixed(1)
    const delezPolBele_1 = (belaMoka * 0.27).toFixed(1)
    const delezCrne_1 = (belaMoka * 0.28).toFixed(1)
    const delezOtrobi_1 = (belaMoka * 0.09).toFixed(1)

    // izracun deleza polbele moke
    const delezBele_2 = (PolBelaMoka * 0.36).toFixed(1)
    const delezPolnozrnate_2 = (PolBelaMoka * 0.27).toFixed(1)
    const delezCrne_2 = (PolBelaMoka * 0.28).toFixed(1)
    const delezOtrobi_2 = (PolBelaMoka * 0.09).toFixed(1)

    // izracun deleza crne moke
    const delezBele_3 = (CrnaMoka * 0.36).toFixed(1)
    const delezPolnozrnate_3 = (CrnaMoka * 0.28).toFixed(1)
    const delezPolBele_3 = (CrnaMoka * 0.27).toFixed(1)
    const delezOtrobi_3 = (CrnaMoka * 0.09).toFixed(1)

    // izracun deleza otrobov
    const delezBele_4 = (otrobi * 0.36).toFixed(1)
    const delezPolBele_4 = (otrobi * 0.27).toFixed(1)
    const delezCrne_4 = (otrobi * 0.09).toFixed(1)
    const delezPolnozrnate_4 = (otrobi * 0.27).toFixed(1)


  return (
    <div className="app">
          <h1>Izracun za placilo</h1>
          {/* Izracun za PLACILO SEKCIJA */}
          <table>
              <thead>
                  <tr>
                      <th>Stehtana kolicina</th>
                      <th></th>
                      <th>{result.value1} Kg</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Kalo</td>
                      <td>{result.value2} % </td>
                      <td>{kalo} Kg</td>
                  </tr>
                  <tr>
                      <td>Teza za obracun:</td>
                      <td></td>
                      <td>{razlika} Kg</td>
                  </tr>

              </tbody>
          </table>

          {/* Izracun za VRACILO SEKCIJA */}
          <h1>Vracilo</h1>
          <div className="tables-container">
              {/* Izracun za VRACILO bela */}
              <table>
                  <thead>
                      <tr>
                          <th>Bela Moka</th>
                          <th>36 %</th>
                          <th>{belaMoka} Kg</th>
                      </tr>
                  </thead>
              </table>
              <table className="middle-table" onClick={handleMiddleTableClick}>
                  <tbody>
                      <tr>
                          <td colSpan="2">spremeni v</td>
                      </tr>
                  </tbody>
              </table>
              {showTable3 && (
                  <table>
                      <thead>
                          <tr>
                              <th>Tip Moke</th>
                              <th>Kg</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Polnozrnata Moka</td>
                              <td>{delezPolnozrnate_1}</td>
                          </tr>
                          <tr>
                              <td>Polbela Moka</td>
                              <td>{delezPolBele_1}</td>
                          </tr>
                          <tr>
                              <td>Crna Moka</td>
                              <td>{delezCrne_1}</td>
                          </tr>
                          <tr>
                              <td>Psenicni Otrobi</td>
                              <td>{delezOtrobi_1}</td>
                          </tr>
                      </tbody>
                  </table>
              )}
          </div>
          <div className="tables-container">
              {/* Izracun za VRACILO Polbela */}
              <table>
                  <thead>
                      <tr>
                          <th>Polbela Moka</th>
                          <th>27 %</th>
                          <th>{PolBelaMoka} Kg</th>
                      </tr>
                  </thead>
              </table>
              <table className="middle-table" onClick={handleMiddleTableClick}>
                  <tbody>
                      <tr>
                          <td colSpan="2">spremeni v</td>
                      </tr>
                  </tbody>
              </table>
              {showTable3 && (
                  <table>
                      <thead>
                          <tr>
                              <th>Tip Moke</th>
                              <th>Kg</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Bela Moka</td>
                              <td>{delezBele_2}</td>
                          </tr>
                          <tr>
                              <td>Polnozrnata Moka</td>
                              <td>{delezPolnozrnate_2}</td>
                          </tr>
                          <tr>
                              <td>Crna Moka</td>
                              <td>{delezCrne_2}</td>
                          </tr>
                          <tr>
                              <td>Psenicni Otrobi</td>
                              <td>{delezOtrobi_2}</td>
                          </tr>
                      </tbody>
                  </table>
              )}
          </div>
          <div className="tables-container">
              {/* Izracun za VRACILO Crna moka */}
              <table>
                  <thead>
                      <tr>
                          <th>Crna Moka</th>
                          <th>9 %</th>
                          <th>{CrnaMoka} Kg</th>
                      </tr>
                  </thead>
              </table>
              <table className="middle-table" onClick={handleMiddleTableClick}>
                  <tbody>
                      <tr>
                          <td colSpan="2">spremeni v</td>
                      </tr>
                  </tbody>
              </table>
              {showTable3 && (
                  <table>
                      <thead>
                          <tr>
                              <th>Tip Moke</th>
                              <th>Kg</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Bela Moka</td>
                              <td>{delezBele_3}</td>
                          </tr>
                          <tr>
                              <td>Polbela Moka</td>
                              <td>{delezPolBele_3}</td>
                          </tr>
                          <tr>
                              <td>Polnozrnata Moka</td>
                              <td>{delezPolnozrnate_3}</td>
                          </tr>

                          <tr>
                              <td>Psenicni Otrobi</td>
                              <td>{delezOtrobi_3}</td>
                          </tr>
                      </tbody>
                  </table>
              )}
          </div>
          <div className="tables-container">
              {/* Izracun za VRACILO Otrobi */}
              <table>
                  <thead>
                      <tr>
                          <th>Psenicni Otrobi</th>
                          <th>27 %</th>
                          <th>{otrobi} Kg</th>
                      </tr>
                  </thead>
              </table>
              <table className="middle-table" onClick={handleMiddleTableClick}>
                  <tbody>
                      <tr>
                          <td colSpan="2">spremeni v</td>
                      </tr>
                  </tbody>
              </table>
              {showTable3 && (
                  <table>
                      <thead>
                          <tr>
                              <th>Tip Moke</th>
                              <th>Kg</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Bela Moka</td>
                              <td>{delezBele_4}</td>
                          </tr>
                          <tr>
                              <td>Polbela Moka</td>
                              <td>{delezPolBele_4}</td>
                          </tr>
                          <tr>
                              <td>Polnozrnata Moka</td>
                              <td>{delezPolnozrnate_4}</td>
                          </tr>

                          <tr>
                              <td>Crna Moka</td>
                              <td>{delezCrne_4}</td>
                          </tr>
                      </tbody>
                  </table>
              )}
          </div>
          {/* Export PDF in vrni se na prvo stran */}
      <button onClick={exportAsPDF} className="export-button">
        Izvozi PDF
      </button>
      <Link to="/" className="back-link">
        Na zacetek
      </Link>
    </div>
  );
};

ReactDOM.render(
  <Router>
    <Routes>
      <Route index path="/" element={<App />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);
