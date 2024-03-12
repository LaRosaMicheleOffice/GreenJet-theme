// Custom Slider
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  setBubble(range, bubble);
});

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

// Default Value Handling
let actual_default_visible_values = {
   duration: 11, // Minutes - Is being manipulated by setDuration()
  flow: 13, //l per Minute
  greenjet_flow: 7.6,
};

let default_visible_values = {
  duration: 11, // Minutes - Is being manipulated by setDuration()
  flow: 13, //l per Minute
  greenjet_flow: 7.6, //l per Minute
  price_unit: 79.0, // € per Unit
};

let default_temperature_values = {
  temperature_cold: 10, // ° Celsius
  temperature_warm: 38, // ° Celsius
};

let actual_default_background_values = {
  cold_water_price: 1.95, // € per m³
  waste_water_price: 2.09, // € per m³
  energy_demand_m3:
    38 - // default_temperature_values["temperature_warm"] -
    10 //default_temperature_values["temperature_cold"], // Kwh /m³
}

let default_background_values = {
  brutto_netto: 1,
  cold_water_price: 1.95, // € per m³
  waste_water_price: 2.09, // € per m³
  energy_demand_m3:
    default_temperature_values["temperature_warm"] -
    default_temperature_values["temperature_cold"], // Kwh /m³
  fuel_details: {
    Teleriscaldamento: {
      c_Kwh: 12.65,
      co2_g_liter: 11.11,
      efficiency: 1,
    },
    Gas: {
      c_Kwh: 15.61,
      co2_g_liter: 12.59,
      efficiency: 1,
    },
    Gasolio: {
      c_Kwh: 14.64,
      co2_g_liter: 11.85,
      efficiency: 1,
    },
    Pellets: {
      c_Kwh: 12.25,
      co2_g_liter: 0.59,
      efficiency: 1,
    },
    Elettrico: {
      c_Kwh: 22.42,
      co2_g_liter: 8.68,
      efficiency: 4,
    },
    "Acqua Fr": {
      c_Kwh: 0,
      co2_g_liter: 0,
      efficiency: 1,
    },
    Personalizzato: {
      c_Kwh: 12.65,
      co2_g_liter: 11.11,
      efficiency: 1,
    }
  },
};

let default_user_input_values = {
  hotel: {
    shower_default: 70,
    person_min: 1,
    person_max: 3,
    person_step: 0.1,
    person_default: 1.7,
    utilization_min: 30,
    utilization_max: 100,
    utilization_default: 70,
  },
  fitness: {
    shower_default: 10,
    person_min: 20,
    person_max: 350,
    person_step: 1,
    person_default: 100,
    utilization_min: 95,
    utilization_max: 95,
    utilization_default: 95,
  },
  betrieb: {
    shower_default: 10,
    person_min: 20,
    person_max: 350,
    person_step: 1,
    person_default: 100,
    utilization_min: 95,
    utilization_max: 100,
    utilization_default: 95,
  },
  bad: {
    shower_default: 10,
    person_min: 20,
    person_max: 350,
    person_step: 1,
    person_default: 100,
    utilization_min: 95,
    utilization_max: 95,
    utilization_default: 95,
  },
};

// PERSONALIZZATO option
  // initial setup
setupElements("");
setupElements("-mob");
function setupElements(local_view_id) {
  el = document.getElementById(`custom-select-gj-calc-id${local_view_id}`);
  el.style.width = "95%";
  el.style.display = "inline-block";

  el = document.getElementById(`custom-select-gj-calc-personalized-settings-icon${local_view_id}`);
  el.style.display = "none";
  el.style.visibility = "hidden";

  el = document.getElementById(`custom-select-gj-calc-params${local_view_id}`);
  el.style.position = "absolute";

  document.addEventListener("click", function(event){
    newel = document.getElementById(`custom-select-gj-calc-params${local_view_id}`);
    settings_icon_clicked = event.target.closest(`#custom-select-gj-calc-personalized-settings-icon${local_view_id}`);
    box_clicked = event.target.closest(`#custom-select-gj-calc-params${local_view_id}`)
    if( settings_icon_clicked || box_clicked ){
      newel.style.visibility = "visible";
      newel.display="block";
      newel.zIndex=100;
      newel.position="relative";
    } else {
      newel.style.visibility = "hidden";
      newel.display="none";
    }
  }, true);

  document.querySelector(`#gj-pers-close-popup${local_view_id}`).addEventListener("click", function() {
    console.log("clicking");
    newel = document.getElementById(`custom-select-gj-calc-params${local_view_id}`);
    newel.style.visibility = "hidden";
    newel.display="none";
  });

  cc = document.querySelector(`#custom-select-gj-calc-params${local_view_id} > div`).children;
  console.log(cc);
  for(var i = 2; i < cc.length; ++i){
    child = cc[i];
    if (child.tagName == "SPAN"){
      console.log(child.children)
      editable_text = child.children[0];

      value_type = child.id;
      set_initial_value(editable_text, value_type, local_view_id);

      
      editable_text.addEventListener("input", function(event) { 
        value_type = event.target.parentElement.id;
        console.log(value_type);

        // only allow numbers and dots. Also, convert the commas to dots
        value = event.target.value;
        value = value.replace(/[^0-9.]/g, '');
        event.target.value = value;
        
        switch (value_type ) {
          case `pers_fuel_cost${local_view_id}`:
            default_background_values["fuel_details"]["Personalizzato"]["c_Kwh"] = value;
            break;
          case `pers_fuel_co2${local_view_id}`:
             default_background_values["fuel_details"]["Personalizzato"]["co2_g_liter"] = value;
            break;
          case `pers_water_temp_cold${local_view_id}`:
            default_temperature_values["temperature_cold"] = value;
            default_background_values["energy_demand_m3"] = default_temperature_values["temperature_warm"] - default_temperature_values["temperature_cold"];
            break;
          case `pers_water_temp_warm${local_view_id}`:
            default_temperature_values["temperature_warm"] = value;
            default_background_values["energy_demand_m3"] = default_temperature_values["temperature_warm"] - default_temperature_values["temperature_cold"];
            break;
          case `pers_water_cost_cold${local_view_id}`:
            default_background_values["cold_water_price"] = value;
            break;
          case `pers_water_cost_waste${local_view_id}`:
            default_background_values["waste_water_price"] = value;
            break;
          case `pers_shower_duration${local_view_id}`:
            setDuration(value, "");
            setDuration(value, "-mob");
            break;
          case `pers_water_rate${local_view_id}`:
            default_visible_values["flow"] = value;
            break;
         case `pers_greenjet_flow${local_view_id}`:
            default_visible_values["greenjet_flow"] = value;
            break;
        }


        setCalcValues(local_view_id);
        writeCalculations(local_view_id);
        
      });
    }
  }
}
function toggle_personalizzato_gear(show, local_id_view){
  el = document.getElementById(`custom-select-gj-calc-personalized-settings-icon${local_id_view}`);

  if( ! show ) {
    el.style.visibility = "hidden";
  } else {
    el.style.visibility = "visible";
    el.style.display = "inline-block";
  }
}
function set_initial_value(element, value_type, local_view_id){
  switch (value_type) {
          case `pers_fuel_cost${local_view_id}`:
            element.value = default_background_values["fuel_details"]["Personalizzato"]["c_Kwh"];
            break;
          case `pers_fuel_co2${local_view_id}`:
             element.value = default_background_values["fuel_details"]["Personalizzato"]["co2_g_liter"];
            break;
          case `pers_water_temp_cold${local_view_id}`:
            element.value = default_temperature_values["temperature_cold"];
            break;
          case `pers_water_temp_warm${local_view_id}`:
            element.value = default_temperature_values["temperature_warm"];
            break;
          case `pers_water_cost_cold${local_view_id}`:
            element.value = default_background_values["cold_water_price"];
            break;
          case `pers_water_cost_waste${local_view_id}`:
            element.value = default_background_values["waste_water_price"];
            break;
          case `pers_shower_duration${local_view_id}`:
            element.value = default_visible_values["duration"];
            break;
          case `pers_water_rate${local_view_id}`:
            element.value = default_visible_values["flow"];
            break;
          case `pers_greenjet_flow${local_view_id}`:
            element.value = default_visible_values["greenjet_flow"];
            break;
        }
}

// Custom Select
createSelectbox("");
createSelectbox("-mob");
function createSelectbox(local_view_id) {
  document.getElementById(`select-option-gj-calc${local_view_id}`).innerHTML =
    Object.keys(default_background_values["fuel_details"])[0];

  let select_box = document.getElementById(
    `custom-select-gj-calc-id${local_view_id}`
  );

  select_box.addEventListener("click", function () {
    checkSelectbox(local_view_id);
  });
}

function checkSelectbox(local_view_id) {
  let check_select = document.getElementsByClassName("select-selected-gj-calc");
  if (check_select.length > 0) {
    destroySelectElements(check_select);
  } else {
    createNewSelectElement(check_select, local_view_id);
  }
}

function createNewSelectElement(check_select, local_view_id) {
  let select_box_placeholder = document.getElementById(
    `select-selected-id${local_view_id}`
  );

  select_text_values = Object.keys(default_background_values["fuel_details"]);

  select_text_values.forEach((selection) => {
    select_element = document.createElement("DIV");
    select_element.setAttribute("class", "select-selected-gj-calc");

    select_text = document.createElement("span");
    select_text.setAttribute("class", "select-text-gj-calc");
    select_text.innerHTML = selection;

    select_element.appendChild(select_text);

    select_box_placeholder.appendChild(select_element);

    select_element.addEventListener("click", function () {
      chooseSelection(selection, check_select, local_view_id);
    });
  });
}

togglePopUpVisibility("");
togglePopUpVisibility("-mob");

function togglePopUpVisibility(local_view_id) {
  document.addEventListener("click", function (event) {
    if (
      event.target.closest(".select-selected-gj-calc") ||
      event.target.closest(".custom-select-gj-calc")
    ) {
      document.getElementById(
        `calculation_explanation${local_view_id}`
      ).style.visibility = "hidden";
      return;
    } else if (event.target.closest(".user-input-description")) {
      destroySelectElements(
        document.getElementsByClassName("select-selected-gj-calc")
      );
      return;
    }
    destroySelectElements(
      document.getElementsByClassName("select-selected-gj-calc")
    );
    document.getElementById(
      `calculation_explanation${local_view_id}`
    ).style.visibility = "hidden";
  });

}

function destroySelectElements(select_menu) {
  [...select_menu].forEach((menu_option) => {
    menu_option.remove();
  });
}

function chooseSelection(selection, check_select, local_view_id) {
  document.getElementById(`select-option-gj-calc${local_view_id}`).innerHTML =
    selection;
  destroySelectElements(check_select);
  readCheckBox(local_view_id);

  console.log(selection);
  if(selection == "Personalizzato") {
    toggle_personalizzato_gear(true, local_view_id);
  }
  else {
    toggle_personalizzato_gear(false, local_view_id);

    objects = ["cold_water_price", "waste_water_price", "energy_demand_m3"];
    for (obj in objects) {
      default_background_values[obj] = actual_default_background_values[obj];
    }

   setDuration( actual_default_visible_values["duration"], local_view_id);
    default_visible_values["flow"] = actual_default_visible_values["flow"];
    default_visible_values["greenjet_flow"] = actual_default_visible_values["greenjet_flow"];
  }
}

// Load Default values
setupNavMenu();

function setupNavMenu() {
  let menus = document.getElementsByClassName("nav-button-gj-calc");
  [...menus].forEach((menu) => {
    menu.addEventListener("click", function () {
      if (menu.id.includes("-mob") === true) {
        changeNavStatus(menu, "-mob");
        checkUtilization(menu.id, "-mob");
        loadDefaultInput(menu.id.replace("-mob", ""), "-mob");
      } else {
        changeNavStatus(menu, "");
        checkUtilization(menu.id, "");
        loadDefaultInput(menu.id, "");
      }
    });
  });
}

function changeNavStatus(nav_menu, local_view_id) {
  if (nav_menu.classList.contains("nav-button-gj-calc-active") === false) {
    let nav_menu_buttons = document.getElementsByClassName(
      `nav-button-gj${local_view_id}`
    );

    [...nav_menu_buttons].forEach((menu_button) => {
      if (
        menu_button.classList.contains("nav-button-gj-calc-active") === true
      ) {
        menu_button.classList.toggle("nav-button-gj-calc-active");
      }
    });

    nav_menu.classList.toggle("nav-button-gj-calc-active");
  }
}

function checkUtilization(id, local_view_id) {
  if (id.includes("hotel")) {
    document.getElementById(
      `utilization-container${local_view_id}`
    ).style.display = "block";
    changePersonString(local_view_id, "hotel", "fitness");
    setDuration(11, local_view_id);
  } else {
    document.getElementById(
      `utilization-container${local_view_id}`
    ).style.display = "none";
    changePersonString(local_view_id, "fitness", "hotel");
    setDuration(6, local_view_id);
  }
}

function changePersonString(local_view_id, activeString, inactiveString) {
  document.getElementById(
    `user-input-description-${activeString}${local_view_id}`
  ).style.display = "block";
  document.getElementById(
    `user-input-description-${inactiveString}${local_view_id}`
  ).style.display = "none";
}

function setDuration(minutes, local_view_id) {
  default_visible_values["duration"] = minutes;
  document.getElementById(`duration${local_view_id}`).innerHTML = minutes;
}

function loadDefaultInput(property_id, local_view_id) {
  checkShower(
    default_user_input_values[`${property_id}`]["shower_default"],
    local_view_id
  );

  let person_input = document.getElementById(`person${local_view_id}`);
  person_input.min = default_user_input_values[`${property_id}`]["person_min"];
  person_input.max = default_user_input_values[`${property_id}`]["person_max"];
  person_input.step =
    default_user_input_values[`${property_id}`]["person_step"];
  person_input.value =
    default_user_input_values[`${property_id}`]["person_default"];
  person_input.dispatchEvent(new Event("input"));
  person_input.dispatchEvent(new Event("change"));

  let utilization_input = document.getElementById(
    `utilization${local_view_id}`
  );
  utilization_input.min =
    default_user_input_values[`${property_id}`]["utilization_min"];
  utilization_input.max =
    default_user_input_values[`${property_id}`]["utilization_max"];
  utilization_input.value =
    default_user_input_values[`${property_id}`]["utilization_default"];
  utilization_input.dispatchEvent(new Event("input"));
  utilization_input.dispatchEvent(new Event("change"));

  setCalcValues(local_view_id);
  writeCalculations(local_view_id);
}

// Calc App

getDefaultKeys(default_visible_values, "");
getDefaultKeys(default_visible_values, "-mob");

function getDefaultKeys(values, local_view_id) {
  let default_keys = Object.keys(values);
  setDefaultValues(default_keys, values, local_view_id);
}

function setDefaultValues(keys, values, local_view_id) {
  keys.forEach((key) => {
    document.getElementById(`${key}${local_view_id}`).innerHTML = values[key]
      .toString()
      .replaceAll(".", ",");
  });
}

// Calculating

let user_input = {
  shower: "",
  "shower-mob": "",
  connection: "",
  "connection-mob": "",
  utilization: "",
  "utilization-mob": "",
  person: "",
  "person-mob": "",
  fuel: "",
};

let calc_values = {
  energy: "",
  "energy-mob": "",
  old_water: "",
  old_energy: "",
  new_water: "",
  new_energy: "",
};

initializeUserInput();

function initializeUserInput() {
  [...document.getElementsByClassName("user-input")].forEach((input_field) => {
    user_input[input_field.id] = input_field.value;
    document
      .getElementById(input_field.id)
      .addEventListener("change", function () {
        user_input[input_field.id] = input_field.value;
        if (input_field.id.includes("-mob") === true) {
          if (input_field.id.includes("shower")) {
            checkShower(input_field.value, "-mob");
          }
          readCheckBox("-mob");
        } else {
          if (input_field.id.includes("shower")) {
            checkShower(input_field.value, "");
          }
          readCheckBox("");
        }
      });
  });
  setupCheckbox();
  prepareCalculation();
}

function prepareCalculation() {
  readCheckBox("");
  readCheckBox("-mob");
}

function setupCheckbox() {
  [...document.getElementsByClassName("user-input-checkbox-all")].forEach(
    (checkbox) => {
      document
        .getElementById(checkbox.id)
        .addEventListener("change", function () {
          if (checkbox.id.includes("-mob") === true) {
            readCheckBox("-mob");
          } else {
            readCheckBox("");
          }
        });
    }
  );
}

setupShowerModifier();

function setupShowerModifier() {
  let modifier = document.getElementsByClassName("shower-modifier");
  [...modifier].forEach((modi) => {
    document
      .getElementById(`${modi.id}`)
      .addEventListener("click", function () {
        if (modi.id.includes("-mob") === true) {
          modifyShower(modi, "-mob");
        } else {
          modifyShower(modi, "");
        }
      });
  });
}

function modifyShower(modi, local_view_id) {
  let operation = modi.innerHTML;
  let old_value = parseInt(
    document.getElementById(`shower${local_view_id}`).value
  );
  let modi_value = 1;
  switch (operation) {
    case "+":
      new_value = old_value + modi_value;
      break;
    case "-":
      new_value = old_value - modi_value;
      break;
  }
  checkShower(new_value, local_view_id);

  readCheckBox(local_view_id);
}

function checkShower(value, local_view_id) {
  value = parseInt(value);
  if (value <= 0 || Number.isInteger(value) === false) {
    alert("Die Anzahl muss mindestens 1 betragen");
    value = 1;
  }
  document.getElementById(`shower${local_view_id}`).value = value;
  user_input[`shower${local_view_id}`] = value;
}

function readCheckBox(local_view_id) {
  user_input[`connection${local_view_id}`] = 0;
  [
    ...document.getElementsByClassName(`user-input-checkbox${local_view_id}`),
  ].forEach((checkbox) => {
    if (checkbox.checked === true) {
      user_input[`connection${local_view_id}`] += 1;
      document
        .getElementById(`checkbox_${checkbox.id}`)
        .classList.add("checkbox-choosen");
      document
        .getElementById(`checkbox_wrapper_${checkbox.id}`)
        .classList.add("checkbox-choosen");
    } else {
      document
        .getElementById(`checkbox_${checkbox.id}`)
        .classList.remove("checkbox-choosen");
      document
        .getElementById(`checkbox_wrapper_${checkbox.id}`)
        .classList.remove("checkbox-choosen");
    }
  });

  if (user_input[`connection${local_view_id}`] > 0) {
    setCalcValues(local_view_id);
    writeCalculations(local_view_id);
  } else {
    alert("Bitte mindestens einen Anschluss auswählen!");
  }
}

function setCalcValues(local_view_id) {
  calc_values[`energy${local_view_id}`] = document.getElementById(
    `select-option-gj-calc${local_view_id}`
  ).innerHTML;
  setExplanation(calc_values[`energy${local_view_id}`], local_view_id);

  calc_values["old_water"] = calcWaterUse("flow");
  calc_values["old_energy"] = calcEngery(
    calc_values["old_water"],
    calc_values[`energy${local_view_id}`]
  );

  calc_values["new_water"] = calcWaterUse("greenjet_flow");
  calc_values["new_energy"] = calcEngery(
    calc_values["new_water"],
    calc_values[`energy${local_view_id}`]
  );

  function calcWaterUse(flow_style) {
    if (default_visible_values["duration"] == 11) {
      return (
        (((default_visible_values[flow_style] *
          default_visible_values["duration"] *
          user_input[`shower${local_view_id}`] *
          user_input[`person${local_view_id}`] *
          user_input[`utilization${local_view_id}`]) /
          100) *
          365) /
        1000
      );
    } else {
      return (
        (((default_visible_values[flow_style] *
          default_visible_values["duration"] *
          user_input[`person${local_view_id}`] *
          user_input[`utilization${local_view_id}`]) /
          100) *
          365) /
        1000
      );
    }
  }

  function calcEngery(water_use, energy) {
    return (
      water_use *
      default_background_values["energy_demand_m3"] *
      (1 / default_background_values["fuel_details"][energy]["efficiency"])
    );
  }
}

setupEventExplanation("");
setupEventExplanation("-mob");

function setupEventExplanation(local_view_id) {
  let explanation = document.getElementById(
    `calculation_headline${local_view_id}`
  );
  explanation.addEventListener("click", function () {
    let visibility = document.getElementById(
      `calculation_explanation${local_view_id}`
    ).style.visibility;
    if (visibility == "" || visibility == "hidden") {
      document.getElementById(
        `calculation_explanation${local_view_id}`
      ).style.visibility = "visible";
    } else {
      document.getElementById(
        `calculation_explanation${local_view_id}`
      ).style.visibility = "hidden";
    }
  });
}

function setExplanation(energy, local_view_id) {
  document.getElementById(`expl_fuel${local_view_id}`).innerHTML = energy;
  document.getElementById(
    `expl_fuel_cost${local_view_id}`
  ).innerHTML = `${default_background_values["fuel_details"][energy]["c_Kwh"]
    .toString()
    .replaceAll(".", ",")} c/KWh`;
  document.getElementById(
    `expl_fuel_co2${local_view_id}`
  ).innerHTML = `${default_background_values["fuel_details"][energy][
    "co2_g_liter"
  ]
    .toString()
    .replaceAll(".", ",")} CO²g/Liter`;
  document.getElementById(
    `expl_water_temp_cold${local_view_id}`
  ).innerHTML = `Temperatura(fredda): ${default_temperature_values["temperature_cold"]} °C`;
  document.getElementById(
    `expl_water_temp_warm${local_view_id}`
  ).innerHTML = `Temperatura(calda): ${default_temperature_values["temperature_warm"]} °C`;
  document.getElementById(
    `expl_water_cost_cold${local_view_id}`
  ).innerHTML = `Circuito dell'acqua fredda: ${default_background_values[
    "cold_water_price"
  ]
    .toString()
    .replaceAll(".", ",")} €/m³`;
  document.getElementById(
    `expl_water_cost_waste${local_view_id}`
  ).innerHTML = `Prezzo delle acque reflue: ${default_background_values[
    "waste_water_price"
  ]
    .toString()
    .replaceAll(".", ",")} €/m³`;

  document.getElementById(`duration${local_view_id}`).innerHTML = default_visible_values["duration"].toString();
  document.getElementById(`flow${local_view_id}`).innerHTML = default_visible_values["flow"].toString();
  document.getElementById(`greenjet_flow${local_view_id}`).innerHTML = default_visible_values["greenjet_flow"].toString();
}

function writeCalculations(local_view_id) {
  document.getElementById(`greenjet_saving${local_view_id}`).innerHTML =
    calcGreenjetSaving();
  document.getElementById(`amount_saving${local_view_id}`).innerHTML =
    Intl.NumberFormat("de-DE").format(calcSavingMoneyDiff(local_view_id));
  document.getElementById(`water_saving${local_view_id}`).innerHTML =
    Intl.NumberFormat("de-DE").format(calcSavingWater());
  document.getElementById(`co2_saving${local_view_id}`).innerHTML =
    Intl.NumberFormat("de-DE").format(calcSavingCo2Diff(local_view_id));
  document.getElementById(`price_total${local_view_id}`).innerHTML =
    Intl.NumberFormat("de-DE").format(calcTotalPrice(local_view_id));
  let amo_time_string = calcAmortizationTime(local_view_id);
  document.getElementById(`amotization_time${local_view_id}`).innerHTML =
    amo_time_string[0];
  document.getElementById(`amotization_time_2${local_view_id}`).innerHTML =
    amo_time_string[1];

  document.getElementById(`amotization_amount${local_view_id}`).innerHTML =
    Intl.NumberFormat("de-DE").format(calcAmortizationAmount(local_view_id));

  document.getElementById(`unit-amount${local_view_id}`).innerHTML =
    calcUnitAmount(local_view_id);
}

function calcGreenjetSaving() {
  return (
    Math.round(
      (1 -
        default_visible_values["greenjet_flow"] /
          default_visible_values["flow"]) *
        100 *
        100
    ) / 100
  )
    .toString()
    .replaceAll(".", ",");
}

function calcSavingMoneyDiff(local_view_id) {
  return (
    Math.floor(
      (calcSavingMoney(
        calc_values["old_water"],
        calc_values["old_energy"],
        calc_values[`energy${local_view_id}`]
      ) -
        calcSavingMoney(
          calc_values["new_water"],
          calc_values["new_energy"],
          calc_values[`energy${local_view_id}`]
        )) /
        10
    ) * 10
  );

  function calcSavingMoney(water_use, energy_demand, energy) {
    let cold_water =
      water_use *
      default_background_values["cold_water_price"] *
      default_background_values["brutto_netto"];
    let waste_water =
      water_use *
      default_background_values["waste_water_price"] *
      default_background_values["brutto_netto"];
    let heating =
      ((energy_demand *
        default_background_values["fuel_details"][energy]["c_Kwh"]) /
        100) *
      default_background_values["brutto_netto"];

    return Math.round(cold_water + waste_water + heating);
  }
}

function calcSavingWater() {
  return (
    Math.floor(
      ((calc_values["old_water"] - calc_values["new_water"]) * 1000) / 10
    ) * 10
  );
}

function calcSavingCo2Diff(local_view_id) {
  return (
    Math.floor(
      (calcSavingCo2(
        calc_values["old_water"],
        default_background_values["fuel_details"][
          calc_values[`energy${local_view_id}`]
        ]["co2_g_liter"]
      ) -
        calcSavingCo2(
          calc_values["new_water"],
          default_background_values["fuel_details"][
            calc_values[`energy${local_view_id}`]
          ]["co2_g_liter"]
        )) /
        10
    ) * 10
  );

  function calcSavingCo2(water_use, co2) {
    return water_use * co2;
  }
}

function calcTotalPrice(local_view_id) {
  return (
    default_visible_values["price_unit"] *
    user_input[`shower${local_view_id}`] *
    user_input[`connection${local_view_id}`] *
    default_background_values["brutto_netto"]
  );
}

function calcAmortizationTime(local_view_id) {
  let amo_time_value = Math.ceil(
    (document
      .getElementById(`price_total${local_view_id}`)
      .innerHTML.toString()
      .replaceAll(".", "") /
      document
        .getElementById(`amount_saving${local_view_id}`)
        .innerHTML.toString()
        .replaceAll(".", "")) *
      12
  );

  if (amo_time_value < 1) {
    amo_time_string = "< 1 Monat";
    amo_two_time_string = "des ersten Monats";
    return [amo_time_string, amo_two_time_string];
  } else if (Math.round(amo_time_value) === 1) {
    amo_time_string = `${Math.round(amo_time_value)} Monat`;
    amo_two_time_string = `${Math.round(amo_time_value)} Monat`;
    return [amo_time_string, amo_two_time_string];
  } else {
    amo_time_string = `${Math.round(amo_time_value)} mesi`;
    amo_two_time_string = `${Math.round(amo_time_value)} Mesi`;
    return [amo_time_string, amo_two_time_string];
  }
}

function calcAmortizationAmount(local_view_id) {
  return Math.round(
    document
      .getElementById(`amount_saving${local_view_id}`)
      .innerHTML.toString()
      .replaceAll(".", "") * 10
  );
}

function calcUnitAmount(local_view_id) {
  let unit_amount =
    user_input[`shower${local_view_id}`] *
    user_input[`connection${local_view_id}`];
  return ` (${unit_amount} Stück)`;
}
