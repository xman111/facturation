const TXTVA_NA = 0.1;
const TXTVA_VO = 0.055;
const PREC_MAL_BASE=1.0;
const PREC_MAL_TX=.0115;
const PREC_MAL_DEDUCTIBLE_TX=.0115;
const PREC_CSG_BASE=0.9825;
const PREC_CSG_TX=.0750;
const PREC_CSG_DEDUCTIBLE_TX=.0510;
const PREC_CRDS_BASE=0.9825;
const PREC_CRDS_TX=.005;
const PREC_CRDS_DEDUCTIBLE_TX=.0;
const PREC_FORM_BASE=1.0;
const PREC_FORM_TX=0.0035;
const PREC_FORM_DEDUCTIBLE_TX=0.0035;
const DIFF_CONT_BASE=1.0;
const DIFF_CONT_TX=0.01;
const DIFF_FORM_BASE=1.0;
const DIFF_FORM_TX=0.001;
const PLAFOND_SS=39228.0;
const PLAFOND_SS_COED=4.0;


var TxTVA;
var ChoixAffilie;
var ChoixDiffuseur;
// INIITIALISATION

function UtilisateurChoiceChange() {
  InitForm();
  Calcul_AllFromHT();
}

function InitForm(){
  // VERIFIE LE CHOIX UTILISATEUR TYPE DE FACTURE
  if (document.getElementById('VO').checked) {
    TxTVA = TXTVA_VO;
  }
  else{
    TxTVA = TXTVA_NA;
  }
  // VERIFIE LE CHOIX UTILISATEUR RATTACHEMENT AGESSA
  if (document.getElementById('Affilie').checked) {
    ChoixAffilie = true;
  }
  else{
    ChoixAffilie = false;
  }
  // VERIFIE LE CHOIX UTILISATEUR TENIR CPTE DU DIFFUSEUR
  if (document.getElementById('DiffuseurOui').checked) {
    ChoixDiffuseur = true;
  }
  else{
    ChoixDiffuseur = false;
  }
}

function Calculate_DetailsAGESSA (myHT) {
  var myAGESSA = [0.0,0.0,0.0,0.0,0.0,0.0];
  myAGESSA[0] = myHT * (PREC_MAL_BASE*PREC_MAL_TX);
  myAGESSA[1] = myHT * (PREC_CSG_BASE*PREC_CSG_TX);
  myAGESSA[2] = myHT * (PREC_CRDS_BASE*PREC_CRDS_TX);
  myAGESSA[3] = myHT * (PREC_FORM_BASE*PREC_FORM_TX);
  myAGESSA[4] = myHT * (DIFF_CONT_BASE*DIFF_CONT_TX);
  myAGESSA[5] = myHT * (DIFF_FORM_BASE*DIFF_FORM_TX);

  return myAGESSA;
}

function Calculate_PrecompteAGESSA (myHT) {
  var PrecAGESSA = [0.0,0.0,0.0,0.0];
  PrecAGESSA[0] = myHT * (PREC_MAL_BASE*PREC_MAL_TX);
  PrecAGESSA[1] = myHT * (PREC_CSG_BASE*PREC_CSG_TX);
  PrecAGESSA[2] = myHT * (PREC_CRDS_BASE*PREC_CRDS_TX);
  PrecAGESSA[3] = myHT * (PREC_FORM_BASE*PREC_FORM_TX);

  PrecAGESSA[0]=Math.round(PrecAGESSA[0]*100.0)/100.0;
  PrecAGESSA[1]=Math.round(PrecAGESSA[1]*100.0)/100.0;
  PrecAGESSA[2]=Math.round(PrecAGESSA[2]*100.0)/100.0;
  PrecAGESSA[3]=Math.round(PrecAGESSA[3]*100.0)/100.0;

  return PrecAGESSA;
}

function Calculate_PrecompteAGESSA_PartDeductible (myHT) {
  var PrecAGESSA_1 = myHT * (PREC_MAL_BASE*PREC_MAL_DEDUCTIBLE_TX);
  var PrecAGESSA_2 = myHT * (PREC_CSG_BASE*PREC_CSG_DEDUCTIBLE_TX);
  var PrecAGESSA_3 = myHT * (PREC_CRDS_BASE*PREC_CRDS_DEDUCTIBLE_TX);
  var PrecAGESSA_4 = myHT * (PREC_FORM_BASE*PREC_FORM_DEDUCTIBLE_TX);

  PrecAGESSA_1=Math.round(PrecAGESSA_1*100.0)/100.0;
  PrecAGESSA_2=Math.round(PrecAGESSA_2*100.0)/100.0;
  PrecAGESSA_3=Math.round(PrecAGESSA_3*100.0)/100.0;
  PrecAGESSA_4=Math.round(PrecAGESSA_4*100.0)/100.0;

  var TotalPrecompteAGESSA_PartDeductible=Math.round((PrecAGESSA_1+PrecAGESSA_2+PrecAGESSA_3+PrecAGESSA_4)*100.0)/100.0;

  return TotalPrecompteAGESSA_PartDeductible;
}
function Calculate_DiffuseurAGESSA (myHT) {
  var DiffAGESSA = [0.0,0.0];
  DiffAGESSA[0] = myHT * (DIFF_CONT_BASE*DIFF_CONT_TX);
  DiffAGESSA[1] = myHT * (DIFF_FORM_BASE*DIFF_FORM_TX);
  DiffAGESSA[0]=Math.round(DiffAGESSA[0]*100.0)/100.0;
  DiffAGESSA[1]=Math.round(DiffAGESSA[1]*100.0)/100.0;

  return DiffAGESSA;
}

function Calculate_TVA (myHT,myTxTVA){
  var myTVA = myHT * myTxTVA;
  return Math.round(myTVA*100.0)/100.0;
}

function Calculate_TTC (myHT,myTxTVA){
  var myTTC = parseFloat(myHT) + Calculate_TVA(myHT,myTxTVA);
  return Math.round(myTTC*100.0)/100.0;
}

function Calcul_AllFromHT() {
  InitForm();
  var ClientAVerserAuteur;
  var ClientAVerserAgessa;
  var ResultatNetAuteur;
  var ComplementDiffuseur;
  var myHT = document.getElementById('fHT').value;
  var myTVA = Calculate_TVA(myHT,TxTVA);
  var myTTC = Calculate_TTC(myHT,TxTVA);
  var myPrecompteArray = Calculate_PrecompteAGESSA (myHT);
  var myPrecompte=Math.round((myPrecompteArray[0]+myPrecompteArray[1]+myPrecompteArray[2]+myPrecompteArray[3])*100.0)/100.0;
  var myDiffuseurArray = Calculate_DiffuseurAGESSA (myHT);
  var myDiffuseur=Math.round((myDiffuseurArray[0]+myDiffuseurArray[1])*100.0)/100.0;

  var myAgessaDetails = Calculate_DetailsAGESSA (myHT);

  document.getElementById("fSelectedTxTVA").innerHTML = TxTVA*100;
  document.getElementById("fComputedTVA").innerHTML = myTVA;
  document.getElementById("fComputedTTC").innerHTML = myTTC;
  document.getElementById("fComputedPrecompte").innerHTML = myPrecompte;
  document.getElementById("fComputedDiffuseur").innerHTML = myDiffuseur;


  document.getElementById("fComputedPrecMaladie").innerHTML = myPrecompteArray[0];
  document.getElementById("fComputedPrecCSG").innerHTML = myPrecompteArray[1];
  document.getElementById("fComputedPrecCRDS").innerHTML = myPrecompteArray[2];
  document.getElementById("fComputedPrecFormation").innerHTML = myPrecompteArray[3];
  document.getElementById("fComputedDiffCotisation").innerHTML = myDiffuseurArray[0];
  document.getElementById("fComputedDiffFormation").innerHTML = myDiffuseurArray[1];

// CALCUL TOTAL AGESSA A PAYER PAR LE CLIENT AVEC PRISE EN COMPTE CHOIX UTILISATEUR --- DIFFUSEUR OU NON ----
  if (ChoixDiffuseur) {
    ComplementDiffuseur=myDiffuseur;
  } else {
    ComplementDiffuseur= 0.0;
  }

// CALCUL DES TOTAUX AVEC PRISE EN COMPTE CHOIX UTILISATEUR --- ASSUJETI OU NON ----
  if (ChoixAffilie) {
    ClientAVerserAuteur = myTTC;
    ClientAVerserAgessa = ComplementDiffuseur;
    ResultatNetAuteur = ClientAVerserAuteur-myTVA-myPrecompte;
  } else {
    ClientAVerserAuteur = myTTC-myPrecompte;
    ClientAVerserAgessa = myPrecompte+ComplementDiffuseur;
    ResultatNetAuteur = ClientAVerserAuteur-myTVA;
  }
  document.getElementById("fComputedAVerserAgessa").innerHTML = ClientAVerserAgessa;
  document.getElementById("fComputedAVerserAuteur").innerHTML = Math.round(ClientAVerserAuteur*100)/100;;
  document.getElementById('fTotalAVerser').value = Math.round(ClientAVerserAuteur*100)/100+ClientAVerserAgessa;

// CALCUL RESTE NET A L'AUTEUR APRES PAIEMENT TVA ET AGESSA SI ASSUJETI
  document.getElementById("fComputedBenefNet").innerHTML = Math.round((ResultatNetAuteur)*100)/100;

}


function Calcul_TotalAVerser_2_HT (){
    InitForm();
    var myHT;
    var TxDiff;

    var ClientTotalaVerser = document.getElementById('fTotalAVerser').value;

    // CALCUL DU HT SELON CHOIX UTILISATEUR DIFFUSEUR
    if (ChoixDiffuseur) {
      TxDiff= DIFF_CONT_BASE*DIFF_CONT_TX + DIFF_FORM_BASE*DIFF_FORM_TX;
    } else {
      TxDiff = 0;
    }
    myHT = parseFloat(ClientTotalaVerser) / (1.0+TxTVA+TxDiff);
    myHT= Math.round(myHT*100.0)/100.0;

    document.getElementById('fHT').value=Math.round(myHT*100)/100;
    Calcul_AllFromHT();

    var NewClientTotalaVerser = document.getElementById('fTotalAVerser').value;
    if (NewClientTotalaVerser-ClientTotalaVerser !=0) {
      alert("Attention, la valeur saisie est INCOMPATIBLE")
    }
    // attention alert si saisi different du resultat de calcul Calcul_AllFromHT
}
