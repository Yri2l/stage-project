// Moments d'ordre r
function Moments_r(data,r) {
	let n=data.length;
	let sum = 0;
	for (const x of data) {
		sum += Math.pow(x, r);
		}
	let m=sum/n;
  return m;
}

// Moments centrés d'ordre r
function Moments_centre_r(data,r) {
	let n=data.length;
	let m=Moments_r(data,1); //moyenne empirique
	let sum = 0;
	for (const x of data) {
		sum += Math.pow(x-m, r);
		}
	let mc=sum/n;
  return mc;
}

//statistiques descriptives des données
function Stats_descriptives(data) {
	let Stats = {};
	Stats["nombre d'observation"] = data.length;
	Stats["minimum"] = Math.min(...data);
	Stats["maximum"] = Math.max(...data);
	Stats["moyenne"] = Moments_r(data, 1).toFixed(4);
	Stats["variance"] = Moments_centre_r(data, 2).toFixed(4);
  
	// skewness
	let m3 = Moments_centre_r(data, 3);
	let m23 = Math.pow(Moments_centre_r(data, 2), 1.5);
	Stats["skewness"] = (m3 / m23).toFixed(4);
  
	// kurtosis
	let m4 = Moments_centre_r(data, 4);
	let m22 = Math.pow(Moments_centre_r(data, 2), 2);
	Stats["kurtosis"] = (-3 + m4 / m22).toFixed(4);
  
	return Stats;
  }
  
//tableau des statistiques descriptives des données (html)
function Stats_descriptives_html(data) {
	let Dict=Stats_descriptives(X);  // dictionnaire des stats
	
	document.write("<table class=\"table table-striped table-bordered w-50 px-3 ms-5\" id=\"theTableElement\">");
	document.write("<tr>");
	document.write("<td  class=\"table-dark text-center align-middle\" colspan=\"2\">statistiques descriptives des données</td>");
	document.write("</tr>");
	for (const key of Object.keys(Dict)) { 
		document.write("<tr>");
		document.write("<td>" +key+ "</td>");
		document.write("<td>" +Dict[key] +"</td>");
		document.write("</tr>");
	  }
	document.write("</table>");
	
	}
	
	
// uniques et effectifs pour les données discrètes
function getUniqueCount(data) {
	let X1=data.sort();
	let uniqueCount = {}; // dictionnaire pour modalités et effectifs
	modalite=[];
	compte=[];
	for (const element of X1) {
		if (uniqueCount[element]) {
		uniqueCount[element] += 1;
		} else {
		uniqueCount[element] = 1;
		}
	};
	
	// ordonner les uniques

	for (const key of Object.keys(uniqueCount).sort()) { 
		modalite.push(key)
		compte.push(uniqueCount[key])
	};
	modalite = trierAbscissesEtEffectifs(modalite, compte)[0];
	compte = trierAbscissesEtEffectifs(modalite, compte)[1];
	return [uniqueCount,modalite,compte];


	}

// simulation d'une chaîne de caractères de longueur 6
function UnelettreAlea() {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	return alphabet[Math.floor(Math.random() * alphabet.length)];
	}

function Etiquette_Alea() {
var chaine = "";
	var randomLetter;
	while (chaine.length < 6) {
	  randomLetter = UnelettreAlea();
	  chaine += randomLetter;
	} 
		return chaine;
	}

/////////////////////////////////////////////////
// couleur aléatoires pour les bars des histogrammes
function couleurrgba() {
    let r = Math.floor(20+Math.random() * 230);
    let g = Math.floor(20+Math.random() * 230);
    let b = Math.floor(20+Math.random() * 230);
	let alpha = (0.1+0.9*Math.random()).toFixed(2);
    let color = "\'rgba(" + r + "," + g + "," + b + "," + alpha +")\'";

	return color;
};

function rgba_vecteur(n) {
	fond_couleur=[];
	for (let i = 0; i < n; i++) { 
		fond_couleur.push(couleurrgba());
	}
	return fond_couleur;
	}
/// Histogramme pour les données discrètes (chart.js)
function HistoDiscret(data){
	data.sort();  // ordonner
	
	let comptage = getUniqueCount(data);
	//const S=comptage[0];
	const valeurs=comptage[1];
	const effectifs=comptage[2];
	
	
	let size = valeurs.length;
	let C1=rgba_vecteur(size);
	  
	let V=[];
	for (let i = 0; i < size; i++) { 
		V.push("'"+valeurs[i]+"\'");
		}
	let E=effectifs;
	let Etiquette=Etiquette_Alea();
  
	
	let nom_chart=String("chart_"+Etiquette);
	  
	  // multiples apples
	let config_chart=String("config"+Etiquette);
	let data_chart="data"+Etiquette;
	 
	const chartCardDiv = document.createElement("div");
	chartCardDiv.classList.add("chartCard");

	const chartBoxDiv = document.createElement("div");
	chartBoxDiv.classList.add("chartBox");

	const canvas = document.createElement("canvas");
	canvas.id = nom_chart;

	chartBoxDiv.appendChild(canvas);
	chartCardDiv.appendChild(chartBoxDiv);

	const setupComment = document.createTextNode("// setup");
	const dataChart = {
	labels: [V],
	datasets: [
		{
		label: "",
		data: [E],
		backgroundColor: [C1],
		borderColor: [C1],
		borderWidth: 1,
		},
	],
	};
	const configChart = {
	type: "bar",
	data: dataChart,
	options: {
		scales: {
		y: {
			beginAtZero: true,
		},
		},
		plugins: {
		legend: {
			display: false,
		},
		},
	},
	};

	const displayComment = document.createTextNode("// afficher");
	const chart = new Chart(canvas.getContext("2d"), configChart);

	document.body.appendChild(chartCardDiv);

		
	
	}

function trierAbscissesEtEffectifs(abscisses, effectifs) {
	// Créer une copie des listes d'abscisses et d'effectifs
	var abscissesCopie = abscisses.slice();
	var effectifsCopie = effectifs.slice();
  
	// Trier les abscisses par ordre croissant
	var indicesTri = abscissesCopie.map(function(_, index) {
	  return index;
	}).sort(function(a, b) {
	  return abscissesCopie[a] - abscissesCopie[b];
	});
  
	// Mettre à jour les listes d'abscisses et d'effectifs
	abscisses = indicesTri.map(function(index) {
	  return abscissesCopie[index];
	});
	effectifs = indicesTri.map(function(index) {
	  return effectifsCopie[index];
	});
  
	// Retourner les listes d'abscisses et d'effectifs triées
	return [abscisses, effectifs];
  }
  
function histogram_Continue(echantillon, nombreDeBarres) {
	// Calculer la plage des données
	var min = Math.min(...echantillon);
	var max = Math.max(...echantillon);
	var plage = max - min;
  
	// Calculer la largeur de chaque barre
	var largeurBarre = plage / nombreDeBarres;
  
	// Initialiser les tableaux pour les abscisses et les effectifs
	var abscisses = [];
	var effectifs = [];
  
	// Parcourir chaque barre de l'histogramme
	for (var i = 0; i < nombreDeBarres; i++) {
	  // Calculer les bornes de la barre
	  var borneInferieure = min + i * largeurBarre;
	  var borneSuperieure = borneInferieure + largeurBarre;
  
	  // Compter le nombre d'éléments dans l'intervalle de la barre
	  var effectif = echantillon.filter(function(element) {
		return element >= borneInferieure && element < borneSuperieure;
	  }).length;
  
	  // Ajouter les abscisses et les effectifs aux tableaux
	  abscisses.push((borneInferieure + borneSuperieure) / 2);
	  effectifs.push(effectif);
	}
  
	// Retourner les tableaux des abscisses et des effectifs
	return trierAbscissesEtEffectifs(abscisses, effectifs);
  }

/* Histogramme Continue */
function getBins(data, numBins) {
	const { counts, binEdges } = histogram_Continue(data, numBins);
  
	const binLabels = [];
	for (let i = 0; i < binEdges.length - 1; i++) {
	  binLabels.push(`${binEdges[i]} - ${binEdges[i + 1]}`);
	}
  
	return {binLabels, counts};
  }

/* Creation Echantillon */

function echantillonsBernoulli(p, taille) {
	const echantillons = [];
	
	for (let i = 0; i < taille; i++) {
	  const echantillon = Math.random() < p ? 1 : 0;
	  echantillons.push(echantillon);
	}
	
	return echantillons;
  }
  

function echantillonsBinomiale(n, p, taille) {
	const echantillons = [];
	
	for (let i = 0; i < taille; i++) {
	  let succes = 0;
	  for (let j = 0; j < n; j++) {
		if (Math.random() < p) {
		  succes++;
		}
	  }
	  echantillons.push(succes);
	}
	
	return echantillons;
  }

function echantillonPoisson(lambda, taille) {
  const echantillons = [];

  for (let i = 0; i < taille; i++) {
    let x = 0;
    let p = Math.exp(-lambda);

    let F = p;

    const u = Math.random();

    while (u > F) {
      x++;
      p = (p * lambda) / x;
      F += p;
    }

    echantillons.push(x);
  }

  return echantillons;
}

function echantillonGeometrique(p, taille) {
	const echantillons = [];
  
	for (let i = 0; i < taille; i++) {
	  let x = 1;
  
	  while (Math.random() >= p) {
		x++;
	  }
  
	  echantillons.push(x);
	}
  
	return echantillons;
  }
  

function echantillonUniformeDiscrete(a, b, taille) {
  a = Math.floor(a);
  b = Math.floor(b);
  taille = Math.floor(taille);

  const echantillon = [];
  
  for (var i = 0; i < taille; i++) {
    var valeur = Math.floor(Math.random() * (b - a + 1)) + a;
    echantillon.push(valeur);
  }
  
  return echantillon;
}


function echantillonUniformeContinue(a, b, taille) {
	a = Math.floor(a);
  	b = Math.floor(b);
  	taille = Math.floor(taille);
	const echantillons = [];
  
	for (let i = 0; i < taille; i++) {
	  const u = Math.random();
	  const echantillon = a + u * (b - a);
	  echantillons.push(echantillon);
	}
  
	return echantillons;
  }
  
  
function echantillonsExponentielle(lambda, taille) {
	const echantillons = [];
	
	for (let i = 0; i < taille; i++) {
	  const u = Math.random();
	  const echantillon = -Math.log(1 - u) / lambda;
	  echantillons.push(echantillon);
	}
	
	return echantillons;
  }


/*function echantillonNormale(mu, sigmaCarre, nbEchantillons) {
	var echantillon = [];
	for (var i = 0; i < nbEchantillons; i++) {
	  var p, p1, p2;
	  do {
		p1 = Math.random() * 2 - 1;
		p2 = Math.random() * 2 - 1;
		p = p1 * p1 + p2 * p2;
	  } while (p >= 1);
	  var valeur = mu + Math.sqrt(-2 * Math.log(p) / p) * Math.sqrt(sigmaCarre) * p1;
	  echantillon.push(valeur);
	}
	console.log(echantillon);
	return echantillon;
}*/
  
function echantillonNormale(mu, sigma, taille) {
	mu = parseFloat(mu);
  sigma = parseFloat(sigma);
  taille = parseInt(taille);
  const echantillons = [];

  for (let i = 0; i < taille; i++) {
    let u = 0;
    let v = 0;
    let s = 0;

    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);

    const x = u * Math.sqrt(-2 * Math.log(s) / s);
	
    const y = mu + sigma * x;
    echantillons.push(y);
  }
  return echantillons;
}

function estimateurNormale(echantillon) {
	const n = echantillon.length;
	let mu = 0;
	let sigma = 1;
	const learningRate = 0.01;
	const numIterations = 1000;
  
	for (let i = 0; i < numIterations; i++) {
	  let sumGradMu = 0;
	  let sumGradSigma = 0;
  
	  for (let j = 0; j < n; j++) {
		const x = echantillon[j];
		const gradMu = (x - mu) / (sigma * sigma);
		const gradSigma = ((x - mu) * (x - mu) - sigma * sigma) / (sigma * sigma * sigma);
		sumGradMu += gradMu;
		sumGradSigma += gradSigma;
	  }
  
	  const updateMu = (learningRate / n) * sumGradMu;
	  const updateSigma = (learningRate / n) * sumGradSigma;
  
	  mu += updateMu;
	  sigma += updateSigma;
	}
  
	return [mu, sigma];
  }
  
  
  
  


function echantillonWeibull(lambda, k, taille) {
	const echantillons = [];
  
	for (let i = 0; i < taille; i++) {
	  const u = Math.random();
	  const echantillon = lambda * Math.pow(-Math.log(1 - u), 1 / k);
	  echantillons.push(echantillon);
	}
  
	return echantillons;
  }

  /*Estimateur basé sur la methode des moments défaillant
  function estimateurWeibull(echantillon) {
	const n = echantillon.length;
	
	// Calcul des moments empiriques
	let sommeX = 0;
	let sommeXCarre = 0;
	
	for (let i = 0; i < n; i++) {
	  sommeX += echantillon[i];
	  sommeXCarre += echantillon[i] ** 2;
	}
	
	const moment1 = sommeX / n;
	const moment2 = sommeXCarre / n;
	
	// Estimation des paramètres de la loi de Weibull
	const estimationK = Math.sqrt(moment2) / moment1;
	const estimationLambda = moment1 / gamma(1 + 1 / estimationK);
	
	return [estimationK, estimationLambda];
  }
  
  // Fonction pour calculer la fonction gamma
  function gamma(x) {
	// Implémentation simplifiée de la fonction gamma
	// Vous pouvez utiliser une bibliothèque mathématique plus complète pour une précision accrue
	if (x === 1) {
	  return 1;
	} else {
	  return (x - 1) * gamma(x - 1);
	}
  }*/

/*function estimateurWeibull(echantillon) {
	const n = echantillon.length;
	let a = 1; // Initialisation du paramètre a
	let b = 1; // Initialisation du paramètre b
	
	const learningRate = 0.01; // Taux d'apprentissage
	const iterations = 1000; // Nombre d'itérations
  
	for (let iter = 0; iter < iterations; iter++) {
	  let gradientA = 0;
	  let gradientB = 0;
  
	  for (let i = 0; i < n; i++) {
		const x = echantillon[i];
		const powerTerm = Math.pow(x, a - 1);
		const expTerm = Math.exp(-Math.pow(x, a));
  
		gradientA += (powerTerm * expTerm * (1 - Math.pow(x, a))) / n;
		gradientB += (powerTerm * expTerm * Math.pow(x, a) * (Math.log(x) - a / x)) / n;
	  }
  
	  a += learningRate * gradientA; // Mise à jour du paramètre a
	  b += learningRate * gradientB; // Mise à jour du paramètre b
	}
	
	return [a, b];
  }*/


  
 /* function estimateurWeibull(echantillon) {
	// Calculer la moyenne empirique et la variance empirique de l'échantillon
	const moyenneEmpirique = echantillon.reduce((acc, val) => acc + val, 0) / echantillon.length;
	const varianceEmpirique = echantillon.reduce((acc, val) => acc + (val - moyenneEmpirique) ** 2, 0) / echantillon.length;
  
	// Estimation des paramètres de la loi Weibull à l'aide de la méthode des moments
	const shapeEstime = Math.sqrt(varianceEmpirique) / moyenneEmpirique;
	const scaleEstime = moyenneEmpirique / gamma(1 + 1 / shapeEstime);
  
	return [shapeEstime, scaleEstime];
  }*/

  
  
  /*function echantillonWeibull(shape, scale, tailleEchantillon) {
	const echantillon = [];
	for (let i = 0; i < tailleEchantillon; i++) {
	  // Génération d'un nombre aléatoire selon la loi de Weibull
	  const randomValue = Math.random();
	  const weibullValue = scale * (-Math.log(1 - randomValue)) ** (1 / shape);
	  echantillon.push(weibullValue);
	}
	return echantillon;
  }*/
  
  // Fonction pour calculer la fonction gamma (utilisée dans estimateurWeibull)
  function gamma(x) {
	if (x === 1) return 1;
	return (x - 1) * gamma(x - 1);
  }
  
  
  function estimateurWeibull(echantillon, maxIterations = 1000, tolerance = 1e-6) {
	// Calcul des moments d'ordre 1 (moyenne) et 2 (variance)
	const mean = echantillon.reduce((acc, val) => acc + val, 0) / echantillon.length;
	const variance = echantillon.reduce((acc, val) => acc + (val - mean) ** 2, 0) / echantillon.length;
  
	// Initialisation des paramètres en utilisant les moments
	let shape = Math.pow(variance / (mean ** 2), -1 / 2);
	let scale = mean / shape;
  
	// Fonction de log-vraisemblance pour la loi de Weibull
	function logLikelihood(shape, scale) {
	  return echantillon.reduce((acc, val) => acc + Math.log(shape / scale) + (shape - 1) * Math.log(val / scale) - (val / scale) ** shape, 0);
	}
  
	// Dérivée partielle de la log-vraisemblance par rapport au paramètre de forme (shape)
	function gradientShape(shape, scale) {
	  return echantillon.reduce((acc, val) => acc + Math.log(val / scale) - (val / scale) ** shape * Math.log(val / scale), 0);
	}
  
	// Dérivée partielle de la log-vraisemblance par rapport au paramètre d'échelle (scale)
	function gradientScale(shape, scale) {
	  return echantillon.reduce((acc, val) => acc + (shape / scale) * ((val / scale) ** shape - 1), 0);
	}
  
	// Algorithme de Newton-Raphson pour maximiser la log-vraisemblance
	let iteration = 0;
	let previousLikelihood = logLikelihood(shape, scale);
	let currentLikelihood = previousLikelihood;
  
	while (iteration < maxIterations && Math.abs(currentLikelihood - previousLikelihood) > tolerance) {
	  // Mise à jour des paramètres en utilisant la méthode de Newton-Raphson
	  const hessianShapeShape = echantillon.reduce((acc, val) => acc - (val / scale) ** shape * Math.log(val / scale) ** 2, 0);
	  const hessianShapeScale = echantillon.reduce((acc, val) => acc + (val / scale) ** shape * Math.log(val / scale), 0);
	  const hessianScaleScale = echantillon.reduce((acc, val) => acc - (shape / (scale ** 2)) * ((val / scale) ** shape - 1), 0);
  
	  const determinantHessian = hessianShapeShape * hessianScaleScale - hessianShapeScale ** 2;
  
	  const updateShape = (gradientScale(shape, scale) * hessianShapeScale - gradientShape(shape, scale) * hessianScaleScale) / determinantHessian;
	  const updateScale = (gradientShape(shape, scale) * hessianScaleScale - gradientScale(shape, scale) * hessianShapeShape) / determinantHessian;
  
	  shape -= updateShape;
	  scale -= updateScale;
  
	  // Calcul de la nouvelle log-vraisemblance
	  previousLikelihood = currentLikelihood;
	  currentLikelihood = logLikelihood(shape, scale);
  
	  iteration++;
	}
  
	return [scale, shape];
  }

function echantillonsGamma(shape, scale,tailleEchantillon) {
	const echantillon = [];
	for (let i = 0; i < tailleEchantillon; i++) {
	  // Génération d'un nombre aléatoire selon la loi gamma
	  const randomValue = Math.random();
	  const gammaValue = -scale * Math.log(randomValue) ** (1 / shape);
	  echantillon.push(gammaValue);
	}
	return echantillon;
  }
// Fonction pour calculer la moyenne d'un tableau de données
function mean(data) {
	var sum = data.reduce(function(a, b) {
	  return a + b;
	}, 0);
	return sum / data.length;
  }
  
  // Fonction pour calculer la variance d'un tableau de données
  function variance(data) {
	var mu = mean(data);
	var sum = data.reduce(function(a, b) {
	  return a + Math.pow(b - mu, 2);
	}, 0);
	return sum / data.length;
  }
  
  // Fonction de log-vraisemblance pour la loi gamma
  function gammaLogLikelihood(params, data) {
	var alpha = params[0];
	var beta = params[1];
	var logLikelihood = 0;
  
	for (var i = 0; i < data.length; i++) {
	  logLikelihood += (alpha - 1) * Math.log(data[i]) - data[i] / beta - alpha * Math.log(beta) - Math.log(Math.gamma(alpha));
	}
  
	return -logLikelihood;
  }
  
  // Algorithme pour trouver le premier estimateur de vraisemblance maximale

  
  function gamma(x) {
	if (x === 0) {
	  return Infinity;
	} else if (x < 0) {
	  return gamma(x + 1) / x;
	} else {
	  var coef = [
		76.18009172947146, -86.50532032941677, 24.01409824083091,
		-1.231739572450155, 0.001208650973866179, -0.000005395239384953
	  ];
	  var sum = 1.000000000190015;
	  var base = x - 1;
	  for (var i = 0; i < 6; i++) {
		base++;
		sum += coef[i] / base;
	  }
	  var tmp = base + 5.5;
	  return Math.sqrt(2 * Math.PI) * Math.pow(tmp, (base + 0.5)) * Math.exp(-tmp) * sum;
	}
  }
  
  function psi(x) {
	if (x === 0) {
	  return -Infinity;
	} else if (x < 0) {
	  return psi(x + 1) - (1 / x);
	} else if (x < 6) {
	  return psi(x + 1) - (1 / x);
	} else {
	  var coef = [
		0.008333333333333333,
		-0.16666666666666666,
		0.008333333333333333,
		-0.003968253968253968,
		0.004166666666666666,
		-0.007575757575757576,
		0.021092796092796094,
		-0.08333333333333333,
		0.4432598039215686
	  ];
	  var sum = 0;
	  var base = 1 / (x * x);
	  for (var i = 0; i < 9; i++) {
		sum += coef[i] * Math.pow(base, i);
	  }
	  return Math.log(x) - (1 / (2 * x)) - sum;
	}
  }
  
  function gradientDescent(objective, gradient, initialParams, learningRate = 0.1, tolerance = 1e-6, maxIterations = 1000) {
	var params = initialParams.slice();
	var prevObjectiveValue = objective(params);
	var iterations = 0;
	while (true) {
	  var grad = gradient(params);
	  for (var i = 0; i < params.length; i++) {
		params[i] -= learningRate * grad[i];
	  }
	  var objectiveValue = objective(params);
	  if (Math.abs(objectiveValue - prevObjectiveValue) < tolerance) {
		break;
	  }
	  prevObjectiveValue = objectiveValue;
	  iterations++;
	  if (iterations >= maxIterations) {
		break;
	  }
	}
	return params;
  }
  // Algorithme pour trouver l'estimateur de vraisemblance maximale des paramètres alpha et beta de la loi gamma
function estimateurGamma(echantillon) {
  // Calculer la moyenne empirique et la variance empirique de l'échantillon
  const moyenneEmpirique = echantillon.reduce((acc, val) => acc + val, 0) / echantillon.length;
  const varianceEmpirique = echantillon.reduce((acc, val) => acc + (val - moyenneEmpirique) ** 2, 0) / echantillon.length;

  // Estimation des paramètres de la loi gamma à l'aide de la méthode des moments
  const alphaEstime = moyenneEmpirique ** 2 / varianceEmpirique;
  const betaEstime = varianceEmpirique / moyenneEmpirique;

  return [alphaEstime,betaEstime];
}

  
   // Algorithme pour trouver le premier estimateur de vraisemblance maximale (paramètre alpha)
function estimateur_gamma_1(data) {

	return estimateurGamma(data)[0];
  }
  
  // Algorithme pour trouver le deuxième estimateur de vraisemblance maximale (paramètre beta)
  function estimateur_gamma_2(data) {
	return estimateurGamma(data)[1];
  }
  

  function estimateur_weibull_1(data) {
	// Estimation du paramètre d'échelle 'a'
	var sum = 0;
	var n = data.length;
	for (var i = 0; i < n; i++) {
	  sum += Math.log(data[i]);
	}
	var estimator_a = Math.exp(sum / n);
	
	return estimator_a;
  }
  
  function estimateur_weibull_2(data) {
	// Estimation du paramètre de forme 'b' étant donné 'a'
	a = estimateur_weibull_1(data);
	var sum = 0;
	var n = data.length;
	for (var i = 0; i < n; i++) {
	  sum += Math.log(data[i] / a);
	}
	var estimator_b = 1 / (sum / n);
	
	return estimator_b;
  }
  

///////////////////////////////////////////////////