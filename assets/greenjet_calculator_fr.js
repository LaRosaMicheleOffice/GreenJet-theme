// Custom Slider
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach(wrap => {
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
let default_visible_values = {
    "utilization": 95, // in %
    "duration": 11, // Minutes
    "flow": 13.1, //l per Minute
    "greenjet_flow": 8.2, //l per Minute
    "price_unit": 78.00 // € per Unit
}

let default_temperature_values = {
    "temperature_cold": 10, // ° Celsius
    "temperature_warm": 38 // ° Celsius
}

let default_background_values = {
    "brutto_netto": 1,
    "cold_water_price": 1.950, // € per m³
    "waste_water_price": 2.090, // € per m³
    "energy_demand_m3": default_temperature_values["temperature_warm"] - default_temperature_values["temperature_cold"], // Kwh /m³
    "fuel_details": {
        "Chauffage urbain":{
            "c_Kwh": 10.181,
            "co2_g_liter":11.11,
            "efficiency": 1
        },
        "Gaz":{
            "c_Kwh": 13.610,
            "co2_g_liter":12.59,
            "efficiency": 1
        },
        "Huile":{
            "c_Kwh": 12.277,
            "co2_g_liter":11.85,
            "efficiency": 1
        },
        "Pellets":{
            "c_Kwh": 6.250,
            "co2_g_liter":0.59,
            "efficiency": 1
        },
        "électricité (pompe à chaleur)":{
            "c_Kwh": 22.840,
            "co2_g_liter":8.68,
            "efficiency": 4
        },
        "Eau froide":{
            "c_Kwh": 0,
            "co2_g_liter":0,
            "efficiency": 1
        }
    }
}

// Custom Select
createSelectbox("");
createSelectbox("-mob");
function createSelectbox(local_view_id){
    
    document.getElementById(`select-option-gj-calc${local_view_id}`).innerHTML = Object.keys(default_background_values['fuel_details'])[0];
    
    let select_box = document.getElementById(`custom-select-gj-calc-id${local_view_id}`);
    
    select_box.addEventListener("click", function(){
        checkSelectbox(local_view_id);
    });

}

function checkSelectbox(local_view_id){
    
    let check_select = document.getElementsByClassName("select-selected-gj-calc")
    if (check_select.length > 0){
        destroySelectElements(check_select);
    }
    else {
        createNewSelectElement(check_select, local_view_id);
    }
}

function createNewSelectElement(check_select, local_view_id){

    let select_box_placeholder = document.getElementById(`select-selected-id${local_view_id}`)

    select_text_values = Object.keys(default_background_values['fuel_details'])

    select_text_values.forEach(selection => {
        select_element = document.createElement("DIV");
        select_element.setAttribute("class", "select-selected-gj-calc");
    
        select_text = document.createElement("span");
        select_text.setAttribute("class", "select-text-gj-calc");
        select_text.innerHTML = selection;
    
        select_element.appendChild(select_text);
    
        select_box_placeholder.appendChild(select_element);

        select_element.addEventListener("click", function(){
            chooseSelection(selection, check_select, local_view_id);
        })
    });
}

togglePopUpVisibility("");
togglePopUpVisibility("-mob");

function togglePopUpVisibility(local_view_id){
    document.addEventListener("click", function(event) {
        if (event.target.closest(".select-selected-gj-calc") || event.target.closest(".custom-select-gj-calc")){
            document.getElementById(`calculation_explanation${local_view_id}`).style.visibility = "hidden";
            return  
        } else if(event.target.closest(".user-input-description")){
            destroySelectElements(document.getElementsByClassName("select-selected-gj-calc"));
            return
        }
        destroySelectElements(document.getElementsByClassName("select-selected-gj-calc"));
        document.getElementById(`calculation_explanation${local_view_id}`).style.visibility = "hidden";

    })
}

function destroySelectElements(select_menu){
    [...select_menu].forEach(menu_option => {
        menu_option.remove();
    });
}

function chooseSelection(selection, check_select, local_view_id){
    document.getElementById(`select-option-gj-calc${local_view_id}`).innerHTML = selection;
    destroySelectElements(check_select);
    readCheckBox(local_view_id);
}


// Calc App

getDefaultKeys(default_visible_values, "");
getDefaultKeys(default_visible_values, "-mob");

function getDefaultKeys(values, local_view_id){
    let default_keys = Object.keys(values);
    setDefaultValues(default_keys, values, local_view_id);
}

function setDefaultValues(keys, values, local_view_id){
    keys.forEach(key => {
        document.getElementById(`${key}${local_view_id}`).innerHTML = (values[key].toString()).replaceAll('.', ',');
    });
}

// Calculating

let user_input = {
    "shower": "",
    "shower-mob": "",
    "connection": "",
    "connection-mob":"",
    "person": "",
    "person-mob": "",
    "fuel": ""
}

let calc_values = {
    "energy": "",
    "energy-mob": "",
    "old_water": "",
    "old_energy": "",
    "new_water": "",
    "new_energy": ""
} 

initializeUserInput();

function initializeUserInput(){
    [...document.getElementsByClassName("user-input")].forEach(input_field => {
        user_input[input_field.id] = input_field.value;
        document.getElementById(input_field.id).addEventListener('change', function(){
            user_input[input_field.id] = input_field.value;
            if (input_field.id.includes("-mob") === true){
                if (input_field.id.includes("shower")){
                    checkShower(input_field.value, "-mob");
                }
                readCheckBox("-mob");
            } else {
                if (input_field.id.includes("shower")){
                    checkShower(input_field.value, "");
                }
                readCheckBox("");
            }
        })
    });
    setupCheckbox();
    prepareCalculation();
}

function prepareCalculation(){
    readCheckBox("");
    readCheckBox("-mob");
}

function setupCheckbox(){
    [...document.getElementsByClassName("user-input-checkbox-all")].forEach(checkbox => {
        document.getElementById(checkbox.id).addEventListener('change', function(){
            if (checkbox.id.includes("-mob") === true){
                readCheckBox("-mob")
            } else {
                readCheckBox("");
            }
        })
        
    });
}

setupShowerModifier();

function setupShowerModifier(){
    let modifier = document.getElementsByClassName("shower-modifier");
    [...modifier].forEach(modi => {
        document.getElementById(`${modi.id}`).addEventListener("click", function(){
            if (modi.id.includes("-mob") === true){
                modifyShower(modi, "-mob");
            } else {
                modifyShower(modi, "");
            }
        })
    });
}

function modifyShower(modi, local_view_id){
    let operation = modi.innerHTML;
    let old_value = parseInt(document.getElementById(`shower${local_view_id}`).value);
    let modi_value = 1;
    switch (operation){
        case "+": 
            new_value = old_value + modi_value;
            break;
        case "-":
            new_value = old_value - modi_value;
            break;
    }
    checkShower(new_value, local_view_id);

    readCheckBox(local_view_id)

}

function checkShower(value, local_view_id){
    value = parseInt(value);
    if(value <= 0 || Number.isInteger(value) === false){
        alert("Le nombre doit être d'au moins 1 !");
        value = 1;
    } 
    document.getElementById(`shower${local_view_id}`).value = value;
    user_input[`shower${local_view_id}`] = value;
}

function readCheckBox(local_view_id){
    user_input[`connection${local_view_id}`] = 0;
    [...document.getElementsByClassName(`user-input-checkbox${local_view_id}`)].forEach(checkbox => {

        if (checkbox.checked === true){
            user_input[`connection${local_view_id}`] += 1;
            document.getElementById(`checkbox_${checkbox.id}`).classList.add("checkbox-choosen");
            document.getElementById(`checkbox_wrapper_${checkbox.id}`).classList.add("checkbox-choosen")
        }
        else {
            document.getElementById(`checkbox_${checkbox.id}`).classList.remove("checkbox-choosen");
            document.getElementById(`checkbox_wrapper_${checkbox.id}`).classList.remove("checkbox-choosen")
        }
    });

    if (user_input[`connection${local_view_id}`] > 0){
        setCalcValues(local_view_id);
        writeCalculations(local_view_id);
    } else {
        alert("Veuillez sélectionner au moins une connexion !");
    }
}

function setCalcValues(local_view_id){

    calc_values[`energy${local_view_id}`] = document.getElementById(`select-option-gj-calc${local_view_id}`).innerHTML;
    setExplanation(calc_values[`energy${local_view_id}`], local_view_id);

    calc_values['old_water'] = calcWaterUse("flow");
    calc_values['old_energy'] = calcEngery(calc_values['old_water'], calc_values[`energy${local_view_id}`]);

    calc_values['new_water'] = calcWaterUse("greenjet_flow");
    calc_values['new_energy'] = calcEngery(calc_values['new_water'], calc_values[`energy${local_view_id}`]);

    function calcWaterUse(flow_style){
        
        return default_visible_values[flow_style] * default_visible_values['duration'] * user_input[`person${local_view_id}`] * default_visible_values['utilization'] / 100 * 365 / 1000;
    } 
    
    function calcEngery(water_use, energy){
        
        return water_use * default_background_values['energy_demand_m3'] * (1/default_background_values['fuel_details'][energy]['efficiency']);
    }
}

setupEventExplanation("");
setupEventExplanation("-mob");

function setupEventExplanation(local_view_id){
    
    let explanation = document.getElementById(`calculation_headline${local_view_id}`);
    explanation.addEventListener("click", function(){
    let visibility = document.getElementById(`calculation_explanation${local_view_id}`).style.visibility;
    if(visibility == "" || visibility == "hidden"){
        document.getElementById(`calculation_explanation${local_view_id}`).style.visibility = "visible";
    }
    else {
        document.getElementById(`calculation_explanation${local_view_id}`).style.visibility = "hidden";
    }
})
}




function setExplanation(energy, local_view_id){

    document.getElementById(`expl_fuel${local_view_id}`).innerHTML = energy;
    document.getElementById(`expl_fuel_cost${local_view_id}`).innerHTML = `${(default_background_values['fuel_details'][energy]['c_Kwh'].toString()).replaceAll('.', ',')} c/KWh`;
    document.getElementById(`expl_fuel_co2${local_view_id}`).innerHTML = `${(default_background_values['fuel_details'][energy]['co2_g_liter'].toString()).replaceAll('.', ',')} CO²g/Liter`;
    document.getElementById(`expl_water_temp_cold${local_view_id}`).innerHTML = `Température de l'eau (froide) : ${default_temperature_values['temperature_cold']} °C`;
    document.getElementById(`expl_water_temp_warm${local_view_id}`).innerHTML = `Température de l'eau (chaude) : ${default_temperature_values['temperature_warm']} °C`;
    document.getElementById(`expl_water_cost_cold${local_view_id}`).innerHTML = `Prix de l'eau froide : ${(default_background_values['cold_water_price'].toString()).replaceAll('.', ',')} €/m³`;
    document.getElementById(`expl_water_cost_waste${local_view_id}`).innerHTML = `Prix des eaux usées: ${(default_background_values['waste_water_price'].toString()).replaceAll('.', ',')} €/m³`;
}

function writeCalculations(local_view_id){

    document.getElementById(`greenjet_saving${local_view_id}`).innerHTML = (calcGreenjetSaving());
    document.getElementById(`amount_saving${local_view_id}`).innerHTML = Intl.NumberFormat('de-FR').format(calcSavingMoneyDiff(local_view_id));
    document.getElementById(`water_saving${local_view_id}`).innerHTML = Intl.NumberFormat('de-FR').format(calcSavingWater());
    document.getElementById(`co2_saving${local_view_id}`).innerHTML = Intl.NumberFormat('de-FR').format(calcSavingCo2Diff(local_view_id));
    document.getElementById(`price_total${local_view_id}`).innerHTML = Intl.NumberFormat('de-FR').format(calcTotalPrice(local_view_id));
    let amo_time_string = calcAmortizationTime(local_view_id);
    document.getElementById(`amotization_time${local_view_id}`).innerHTML = amo_time_string[0];  
    document.getElementById(`amotization_time_2${local_view_id}`).innerHTML = amo_time_string[1]; 
    
    document.getElementById(`amotization_amount${local_view_id}`).innerHTML = Intl.NumberFormat('de-FR').format(calcAmortizationAmount(local_view_id));
    
    document.getElementById(`unit-amount${local_view_id}`).innerHTML = calcUnitAmount(local_view_id);
}

function calcGreenjetSaving(){

    return (Math.round(((1 - (default_visible_values["greenjet_flow"] / default_visible_values["flow"])) * 100) * 100) / 100).toString().replaceAll('.', ',');
}

function calcSavingMoneyDiff(local_view_id){
    return Math.floor((calcSavingMoney(calc_values['old_water'], calc_values['old_energy'], calc_values[`energy${local_view_id}`]) - calcSavingMoney(calc_values['new_water'], calc_values['new_energy'], calc_values[`energy${local_view_id}`])) / 10) * 10;
    
    function calcSavingMoney(water_use, energy_demand, energy){
        let cold_water = water_use * default_background_values['cold_water_price'] * default_background_values['brutto_netto'];
        let waste_water = water_use * default_background_values['waste_water_price'] * default_background_values['brutto_netto'];
        let heating = energy_demand * default_background_values['fuel_details'][energy]['c_Kwh'] / 100 * default_background_values['brutto_netto'];

        return Math.round(cold_water + waste_water + heating);
    }
}

function calcSavingWater(){

    return Math.floor(((calc_values['old_water'] - calc_values['new_water']) * 1000) / 10) * 10;
}

function calcSavingCo2Diff(local_view_id){

    return Math.floor((calcSavingCo2(calc_values['old_water'], default_background_values['fuel_details'][calc_values[`energy${local_view_id}`]]['co2_g_liter']) - calcSavingCo2(calc_values['new_water'], default_background_values['fuel_details'][calc_values[`energy${local_view_id}`]]['co2_g_liter'])) / 10 ) * 10;

    function calcSavingCo2(water_use, co2){
        return water_use * co2; 
    }
}

function calcTotalPrice(local_view_id){
    return default_visible_values['price_unit'] * user_input[`shower${local_view_id}`] * user_input[`connection${local_view_id}`] * default_background_values['brutto_netto'];
}

function calcAmortizationTime(local_view_id){
    
    let amo_time_value = (document.getElementById(`price_total${local_view_id}`).innerHTML).toString().replaceAll('.', '') / (document.getElementById(`amount_saving${local_view_id}`).innerHTML).toString().replaceAll('.', '') * 12;
    if (amo_time_value < 1){
        amo_time_string = "< 1 mois";
        amo_two_time_string = "du premier mois";
        return [amo_time_string, amo_two_time_string]

    } else if(Math.round(amo_time_value) === 1){
        amo_time_string = `${Math.round(amo_time_value)} Mois`;
        amo_two_time_string = `${Math.round(amo_time_value)} Mois`
        return [amo_time_string, amo_two_time_string]

    } else {
        amo_time_string = `${Math.round(amo_time_value)} Mois`;
        amo_two_time_string = `${Math.round(amo_time_value)} Mois`;
        return [amo_time_string, amo_two_time_string]
    }
}

function calcAmortizationAmount(local_view_id){
    return Math.round((document.getElementById(`amount_saving${local_view_id}`).innerHTML).toString().replaceAll('.', '') * 10);
}

function calcUnitAmount(local_view_id){
    
    let unit_amount = user_input[`shower${local_view_id}`] * user_input[`connection${local_view_id}`];
    return ` (${unit_amount} pièce)`;
}