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
	Stats["minimum"] = Math.min(...data).toFixed(4);
	Stats["maximum"] = Math.max(...data).toFixed(4);
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
/*function getUniqueCount(data) {
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


	}*/
function getUniqueCount(data) {
	let uniqueCount = {};
  for (const element of data) {
    if (uniqueCount[element]) {
      uniqueCount[element] += 1;
    } else {
      uniqueCount[element] = 1;
    }
  }

  let abscisse = [];
  let ordonnee = [];
  for (const key of Object.keys(uniqueCount).sort((a, b) => a - b)) {
    abscisse.push(parseInt(key, 10)); // Convertir en entier
    ordonnee.push(uniqueCount[key]);
  }

  return [abscisse, ordonnee];
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
	const valeurs=comptage[0];
	const effectifs=comptage[1];
	
	
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
function extractNumbers(arr) {
  const result = [];
  for (const item of arr) {
    const numStr = item.replace(/[^\d.-]/g, ''); // Utilisation d'une expression régulière pour supprimer tout ce qui n'est pas un chiffre, un point ou un signe négatif
    if (numStr !== '' && !isNaN(numStr)) {
      result.push(Number(numStr));
    }
  }
  return result;
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
  let sigmaSquared = 0; // Carré de la variance
  const learningRate = 0.01;
  const numIterations = 1000;

  // Calcul de la moyenne empirique
  for (let i = 0; i < n; i++) {
    mu += echantillon[i];
  }
  mu /= n;

  // Calcul de la variance empirique
  for (let i = 0; i < n; i++) {
    sigmaSquared += Math.pow(echantillon[i] - mu, 2);
  }
  sigmaSquared /= n;

  let sigma = Math.sqrt(sigmaSquared); // Calcul de l'écart-type à partir de la variance

  for (let i = 0; i < numIterations; i++) {
    let sumGradMu = 0;
    let sumGradSigma = 0;

    for (let j = 0; j < n; j++) {
      const x = echantillon[j];
      const gradMu = (x - mu) / (sigma * sigma);
      const gradSigma = ((x - mu) * (x - mu) - sigmaSquared) / (sigma * sigma * sigma);
      sumGradMu += gradMu;
      sumGradSigma += gradSigma;
    }

    const updateMu = (learningRate / n) * sumGradMu;
    const updateSigma = (learningRate / n) * sumGradSigma;

    mu += updateMu;
    sigmaSquared += updateSigma;
    sigma = Math.sqrt(sigmaSquared); // Mettre à jour l'écart-type à partir de la nouvelle variance
  }

  return [mu, sigma];
}

  
  
  
  


function echantillonWeibull(lambda, k, taille) {
	let echantillons = [];
  
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


function moyenneEmpirique(echantillon) {
  const somme = echantillon.reduce((acc, val) => acc + val, 0);
  return somme / echantillon.length;
}

function varianceEmpirique(echantillon) {
  const moyenne = moyenneEmpirique(echantillon);
  const differencesCarrees = echantillon.map(val => (val - moyenne) ** 2);
  const sommeDesDifferencesCarrees = differencesCarrees.reduce((acc, val) => acc + val, 0);
  return sommeDesDifferencesCarrees / echantillon.length;
}

function estimateurBinomiale(echantillon) {
  const moyenne = moyenneEmpirique(echantillon);
  const variance = varianceEmpirique(echantillon);

  // Résoudre les équations pour n et p
  const p = 1 - (variance / moyenne);
  const n = moyenne / p;

  return [Math.round(n), p];
}

  function gamma(x) {
	const sqrtTwoPi = Math.sqrt(2 * Math.PI);
	const g = 7;
	const coefficients = [
	  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
	  771.32342877765313, -176.61502916214059, 12.507343278686905,
	  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
	];
  
	if (x < 0.5) {
	  return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
	}
  
	x -= 1;
	let a = coefficients[0];
	let t = x + g + 0.5;
  
	for (let i = 1; i < coefficients.length; i++) {
	  a += coefficients[i] / (x + i);
	}
  
	return sqrtTwoPi * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  }
  
function mean(array) {
  return array.reduce((sum, value) => sum + value, 0) / array.length;
}

function varianceEmpiriquef(data) {
  const n = data.length;
  const moyenneEmpirique = data.reduce((sum, value) => sum + value, 0) / n;
  return data.reduce((sum, value) => sum + (value - moyenneEmpirique) ** 2, 0) / n;
}

function linearRegressionCoefficients(xData, yData) {
	if (xData.length !== yData.length) {
	  throw new Error("Les tableaux xData et yData doivent avoir la même longueur.");
	}
  
	const n = xData.length;
  
	// Calcul des moyennes de x et y
	const meanX = xData.reduce((acc, val) => acc + val, 0) / n;
	const meanY = yData.reduce((acc, val) => acc + val, 0) / n;
  
	// Calcul des termes nécessaires pour les coefficients
	let sumXY = 0;
	let sumXSquare = 0;
  
	for (let i = 0; i < n; i++) {
	  sumXY += xData[i] * yData[i];
	  sumXSquare += xData[i] * xData[i];
	}
  
	// Calcul des coefficients alpha (intercept) et beta (pente)
	const beta = (n * sumXY - n * meanX * meanY) / (n * sumXSquare - n * meanX * meanX);
	const alpha = meanY - beta * meanX;
  
	return [alpha, beta];
  }


function approx(echantillon, alpha, beta) {
  // Calcul de la taille de l'échantillon

  return alpha+beta*echantillon;
}

function compute(n, tableau1, tableau2, alpha, beta) {
  const tape = [];

  // Calcul de la perte (loss)
  const d = loss(n, tableau1, tableau2, alpha, beta);

  // Initialiser le gradient à 1
  d.grad = 1;

  // Réaliser la rétropropagation (backpropagation)
  for (const b of tape.reverse()) {
    b();
  }

  return d;
}

// Fonction pour effectuer une étape d'optimisation
function optimize(loss, params) {
  const learningRate = 0.0001; // Taux d'apprentissage par défaut

  const d = compute(loss, params);

  // Descente de gradient
  for (let j = 0; j < params.length; j++) {
    const p = params[j];
    p.val -= learningRate * p.grad;
    p.grad = 0;
  }

  return d;
}

function loss(n, tableau1, tableau2, alpha, beta) {
	let total = num(0)
	for (let i = 0; i < n; i++) {
		const x = tableau1[i]
		const y = tableau2[i]
		const d = Math.min(y, approx(x,alpha, beta))
		total += d * d;
  }
  return total / n;
}	
function linearRegressionGradientDescent(data, learningRate = 0.0001, iterations = 100) {
    const nSamples = data.length; // Nombre d'échantillons

    // Initialisation des coefficients (alpha et beta)
    let alpha = 0;
    let beta = 0;

    // Fonction d'approximation de la droite de régression
    function approx(x) {
        return alpha + beta * x;
    }



    // Entraînement de la régression linéaire par descente de gradient
    for (let iteration = 0; iteration < iterations; iteration++) {
        let gradientAlpha = 0;
        let gradientBeta = 0;

        // Calcul des gradients
        for (let i = 0; i < nSamples; i++) {
            const x = i;
            const y = data[i];
            const error = y - approx(x);
            gradientAlpha += error;
            gradientBeta += error * x;
        }

        // Mise à jour des coefficients par descente de gradient
        alpha += learningRate * gradientAlpha / nSamples;
        beta += learningRate * gradientBeta / nSamples;
    }

    return { alpha, beta };
}
function estimateurWeibull(echantillon) {
	// Calcul de la taille de l'échantillon
	const n = echantillon.length;
	
	// Trier l'échantillon en ordre croissant
	if(n != 0)
		echantillon.sort((a, b) => a - b);
  
	// Premier tableau: ln(xi)
	const tableau1 = echantillon.map(x => Math.log(x));
	// Deuxième tableau: yi = ln(-ln(1-zi))
	const tableau2 = [];
	for (let i = 1; i <= n; i++) {
	  const zi = (i - 0.3) /( n + 0.4);
	  const yi = Math.log(-Math.log(1 - zi));
	  tableau2.push(yi);
	}
	
	// Calcul de la moyenne empirique de hn(x) et y
	const moyenneHnX = moyenneEmpirique(tableau1);
	const moyenneY = moyenneEmpirique(tableau2);
  
	// Troisième tableau: ln(xi) - moyenne empirique de hn(x)
	const tableau3 = tableau1.map(x => x - moyenneHnX);
	// Quatrième tableau: yi - moyenne empirique de y
	const tableau4 = tableau2.map(y => y - moyenneY);
	// Calcul de Beta
	let sommeProduits = 0;
	let sommeCarres = 0;
  
	for (let i = 0; i < n; i++) {
	  const produit = (tableau3[i]) * tableau4[i];
	  const carre = Math.pow(tableau3[i], 2);
	  sommeProduits += produit;
	  sommeCarres += carre;
	}
	
	const beta = sommeProduits / sommeCarres;
  
	// Calcul de alpha
	moyenneX = moyenneEmpirique(echantillon);
	const alpha = moyenneX/gamma(1+(1/beta));
	

	return [alpha, beta];
  }

/*function echantillonsGamma(shape, scale,tailleEchantillon) {
	const echantillon = [];
	for (let i = 0; i < tailleEchantillon; i++) {
	  // Génération d'un nombre aléatoire selon la loi gamma
	  const randomValue = Math.random();
	  const gammaValue = -scale * Math.log(randomValue) ** (1 / shape);
	  echantillon.push(gammaValue);
	}
	return echantillon;
  }*/

function echantillonsGamma(shape, scale, tailleEchantillon) {
  const echantillon = [];
  for (let i = 0; i < tailleEchantillon; i++) {
    let sum = 0;
    for (let j = 0; j < shape; j++) {
      sum += -Math.log(Math.random());
    }
    echantillon.push(sum * scale);
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

  /*Exponentielle*/
function likelihood(data, lambda) {
  let likelihood = 1;
  for (let i = 0; i < data.length; i++) {
    likelihood *= lambda * Math.exp(-lambda * data[i]);
  }
  return likelihood;
}

// Fonction de gradient de la log-vraisemblance
function gradient_expo(data, lambda) {
  let gradient = 0;
  for (let i = 0; i < data.length; i++) {
    gradient += (1 / lambda - data[i]);
  }
  return gradient;
}

// Estimation du paramètre lambda par la descente de gradient
function estimateur2_exponentielle(data) {
const initialLambda = 0.5; // Valeur initiale de lambda
const learningRate = 0.01; // Taux d'apprentissage de la descente de gradient
const iterations = 5000; // Nombre d'itérations de la descente de gradient
const tolerance = 0.0001;
  let lambda = initialLambda;
  for (let i = 0; i < iterations; i++) {
    const grad = gradient_expo(data, lambda);
    lambda += learningRate * grad;
	if(Math.abs(grad) < tolerance)
	{
		console.log(`Convergence atteinte après ${i + 1} itérations.`);
		break;
	}
  }
  return lambda.toFixed(4);
}

  /*Uniforme Continue*/
// Fonction de log-vraisemblance pour une loi uniforme continue
function logLikelihood(data, a, b) {
	const n = data.length;
	const logLikelihood = n * Math.log(1 / (b - a));
	return logLikelihood;
  }
  
  // Fonction de gradient de la log-vraisemblance pour une loi uniforme continue
  function gradient(data, a, b) {
	const n = data.length;
	const gradientA = -n / (b - a);
	const gradientB = n / (b - a);
	return [gradientA, gradientB];
  }
  
  // Estimation des paramètres a et b par la descente de gradient
  function estimateur2_uniformeContinue(data) {
	const initialA = -100;
const initialB = 100;
const learningRate = 0.1;
const iterations = 10000;
	let a = initialA;
	let b = initialB;
  
	for (let i = 0; i < iterations; i++) {
	  const [gradA, gradB] = gradient(data, a, b);
	  a = Math.max(a + learningRate * gradA, Math.min(b, Math.max(a, initialA)));
      b = Math.min(b + learningRate * gradB, Math.max(a, Math.min(b, initialB)));
		/*Par rapport à a += learningRate * gradA;
    b += learningRate * gradB;
		Cette modification assure que a et b restent à l'intérieur de l'intervalle [a, b] à chaque itération de la descente de gradient, ce qui devrait fournir des estimations plus fiables, même lorsque les valeurs initiales sont proches des bords de l'intervalle.*/
	}
  
	return [a.toFixed(4), b.toFixed(4)];
  }l

/*Loi de Poisson*/
function logLikelihood(data, lambda) {
	let logLikelihood = 0;
	for (let i = 0; i < data.length; i++) {
	  logLikelihood += -lambda + data[i] * Math.log(lambda) - factorial(data[i]);
	}
	return logLikelihood;
  }
  
  // Fonction de gradient de la log-vraisemblance pour une distribution de Poisson
  function gradient_poisson(data, lambda) {
	let gradient = 0;
	for (let i = 0; i < data.length; i++) {
	  gradient += data[i]/lambda - 1;
	}
	return gradient;
  }
  
  // Fonction pour calculer le factoriel
  function factorial(n) {
	if (n === 0 || n === 1) {
	  return 1;
	}
	return n * factorial(n - 1);
  }
  
  // Estimation du paramètre lambda par la descente de gradient
  function estimateur2_Poisson(data) {
	const initialLambda = 3; // Valeur initiale de lambda
const learningRate = 0.001; // Taux d'apprentissage de la descente de gradient
const iterations = 50000; // Nombre d'itérations de la descente de gradient
const tolerance = 0.0001;
	let lambda = initialLambda;
	for (let i = 0; i < iterations; i++) {
	  const grad = gradient_poisson(data, lambda);
	  lambda += learningRate * grad;
	  if(Math.abs(grad) < tolerance)
		{
			console.log(`Convergence atteinte après ${i + 1} itérations.`);
			break;
		}
	}
	return lambda.toFixed(4);
  }

/*Loi Normale*/
// Fonction de log-vraisemblance pour une distribution normale
function logLikelihood(data, mean, stdDev) {
	const n = data.length;
	const logLikelihood = (-n / 2) * Math.log(2 * Math.PI * stdDev * stdDev) - 
	  (1 / (2 * stdDev * stdDev)) * data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0);
	return logLikelihood;
  }
  
  // Fonction de gradient de la log-vraisemblance pour une distribution normale
  function gradient_normale(data, mean, stdDev) {
	let gradMean = 0;
	let gradStdDev = 0;
	for (let i = 0; i < data.length; i++) {
		gradMean += (1 / (stdDev * stdDev))*(data[i]-mean);
		gradStdDev += ((1 / (stdDev * stdDev* stdDev))*((data[i]-mean)*(data[i]-mean))-(1/stdDev));
	  }
	return [gradMean, gradStdDev];
  }
  
  // Estimation des paramètres mean (moyenne) et stdDev (écart type) par la descente de gradient
  function estimateur2_normale(data) {
	const initialMean = 3.0; // Valeur initiale de la moyenne
const initialStdDev = 1.0; // Valeur initiale de l'écart type
const learningRate = 0.0001; // Taux d'apprentissage de la descente de gradient
const iterations = 50000; // Nombre d'itérations de la descente de gradient
	const tolerance = 0.0001;
	let mean = initialMean;
	let stdDev = initialStdDev;
	let grad=0;
	for (let i = 0; i < iterations; i++) {
	  const [gradMean, gradStdDev] = gradient_normale(data, mean, stdDev);
	  mean += learningRate * gradMean;
	  stdDev += learningRate * gradStdDev;
		grad=Math.sqrt(gradMean*gradMean+gradStdDev*gradStdDev);
		if(grad < tolerance)
		{
			console.log(`Convergence atteinte après ${i + 1} itérations.`);
			break;
		}
	}
  
	return [mean, stdDev*stdDev];
  }

/*Loi de Bernouilli*/
  // Fonction de log-vraisemblance pour une distribution de Bernoulli
function logLikelihood(data, p) {
	let logLikelihood = 0;
	for (let i = 0; i < data.length; i++) {
	  logLikelihood += data[i] === 1 ? Math.log(p) : Math.log(1 - p);
	}
	return logLikelihood;
  }
  
  // Fonction de gradient de la log-vraisemblance pour une distribution de Bernoulli
  function gradient(data, p) {
	let grad = 0;
	for (let i = 0; i < data.length; i++) {
	  grad += (data[i] - p) / (p * (1 - p));
	}
	return grad/data.length;
  }
  
  // Estimation du paramètre p par la descente de gradient avec critère d'arrêt
  function estimateur2_Bernouilli(data) {
	const initialP = 0.5; // Valeur initiale de p
	const learningRate = 0.01; // Taux d'apprentissage de la descente de gradient
	const maxIterations = 10000; // Nombre maximal d'itérations
	const tolerance = 0.001; // Tolérance pour le critère d'arrêt
	let p = initialP;
  
	for (let i = 0; i < maxIterations; i++) {
	  const grad = gradient(data, p);
	  p += learningRate * grad;
  
  
	  // Vérification du critère d'arrêt
	  if (Math.abs(grad) < tolerance) {
		break; // Convergence atteinte
	  }
  
	}
  
	return p;
  }
 
/*Loi Binomiale*/


// Estimation des paramètres n (nombre d'essais) et p (probabilité de succès) par la descente de gradient avec critère d'arrêt
function estimateur2_Binomiale(data, n) {
const initialP = 0.5; // Valeur initiale de p
const learningRate = 0.0001; // Taux d'apprentissage de la descente de gradient
const maxIterations = 10000; // Nombre maximal d'itérations
const tolerance = 0.01; // Tolérance pour le critère d'arrêt
let p = initialP;

for (let i = 0; i < maxIterations; i++) {
  const gradP = gradientBinomial(data, n, p);
  p += learningRate * gradP;

  if(Math.abs(gradP) < tolerance)
  {
	console.log(`Convergence atteinte après ${i + 1} itérations.`);
	break;
  }
}

return [n, p];
}
  
  // Fonction de gradient pour une distribution binomiale

  function calculerCoefficientBinomial(n, k) {
	if (k < 0 || k > n) {
	  return 0;
	}
  
	let coefficient = 1;
	
	for (let i = 0; i < k; i++) {
	  coefficient *= (n - i) / (i + 1);
	}
  
	return Math.round(coefficient); // Arrondir le résultat si nécessaire
  }

  function gradientBinomial(data, n, p) {
	const nData = data.length;
	let gradP = 0;
  
	for (let i = 0; i < nData; i++) {
	  gradP += ((calculerCoefficientBinomial(n, data[i])*(data[i]/p))-(calculerCoefficientBinomial(n, data[i])*(n-data[i])/(1-p)))
	}
  
	return gradP / nData;
  }



  /*Loi Geometrique*/
  // Estimation du paramètre p d'une distribution géométrique par la descente de gradient
function estimateur2_Geometrique(data) {
  const initialP = 0.2; // Valeur initiale de p
  const learningRate = 0.001; // Taux d'apprentissage de la descente de gradient
  const maxIterations = 50000; // Nombre maximal d'itérations
  const tolerance = 0.01; // Tolérance pour le critère d'arrêt basé sur la norme du gradient
  let p = initialP;

  for (let i = 0; i < maxIterations; i++) {
    const grad = gradientGeometric(data, p);
    p += learningRate * grad;

    // Calcul de la norme du gradient à chaque itération
    const gradNorm = Math.abs(grad);

    // Vérification du critère d'arrêt basé sur la norme du gradient
    if (gradNorm < tolerance) {
      console.log(`Convergence atteinte après ${i + 1} itérations.`);
      break; // Sortir de la boucle si le critère d'arrêt est satisfait
    }

  }

  return p;
}
  
  // Fonction de gradient pour une distribution géométrique
  function gradientGeometric(data, p) {
	const nData = data.length;
	let gradP = 0;
  
	for (let i = 0; i < nData; i++) {
	  gradP += ((data[i]-1)/p)-(1/(1-p));
	}
  
	return gradP / nData;
  }
  
  /*Loi Uniforme Discrete*/
  function logLikelihoodUniformDiscrete(data, a, b) {
	const nData = data.length;
	let logLikelihood = 0;
  
	for (let i = 0; i < nData; i++) {
	  if (data[i] >= a && data[i] <= b) {
		logLikelihood -= Math.log(b - a + 1);
	  } else {
		return -Infinity; // Si une valeur est en dehors de l'intervalle, la log-vraisemblance est -Infinity
	  }
	}
  
	return logLikelihood;
  }
  
  // Fonction de gradient pour une distribution uniforme discrète
  function gradientUniformDiscrete(data, a, b) {
	const nData = data.length;
	let gradA = 0;
	let gradB = 0;
  
	for (let i = 0; i < nData; i++) {
	  if (data[i] < a) {
		gradA -= 1 / (b - a + 1);
		gradB += 1 / (b - a + 1);
	  } else if (data[i] > b) {
		gradA += 1 / (b - a + 1);
		gradB -= 1 / (b - a + 1);
	  }
	}
  
	return [gradA / nData, gradB / nData];
  }
  
function estimateur2_uniformeDiscrete(data) {
  const initialA = -10; // Valeur initiale de a
  const initialB = 10; // Valeur initiale de b
  const learningRate = 0.01; // Taux d'apprentissage de la descente de gradient
  const maxIterations = 30000; // Nombre maximal d'itérations
  const tolerance = 0.0001; // Tolerance pour le critère d'arrêt
  let a = initialA;
  let b = initialB;

  for (let i = 0; i < maxIterations; i++) {
    const [gradA, gradB] = gradientUniformDiscrete(data, a, b);
    a += learningRate * gradA;
    b += learningRate * gradB;

    // Calculer la norme du gradient pour le critère d'arrêt
    const gradientNorm = Math.sqrt(gradA * gradA + gradB * gradB);

    // Vérifier si la norme du gradient est inférieure à la tolérance
    if (gradientNorm < tolerance) {
      console.log(`Convergence atteinte après ${i + 1} itérations.`);
      break; // Sortir de la boucle si le critère d'arrêt est satisfait
    }
  }

  return [a, b];
}


  /*Loi Gamma*/
  // Fonction de log-vraisemblance pour une distribution gamma
function logLikelihoodGamma(data, alpha, beta) {
	const nData = data.length;
	let logLikelihood = 0;
  
	for (let i = 0; i < nData; i++) {
	  if (data[i] > 0) {
		logLikelihood += (alpha - 1) * Math.log(data[i]) - data[i] / beta - alpha * Math.log(beta) - Math.log(gammaFunction(alpha));
	  } else {
		return -Infinity; // Si une valeur est négative ou nulle, la log-vraisemblance est -Infinity
	  }
	}
  
	return nData * logLikelihood;
  }
  
  // Fonction de gradient pour une distribution gamma
  function gradientGamma(data, alpha, beta) {
	const nData = data.length;
	let gradAlpha = 0;
	let gradBeta = 0;
  
	for (let i = 0; i < nData; i++) {
	  if (data[i] > 0) {
		gradAlpha += Math.log(data[i]) - digammaFunction(alpha) - Math.log(beta);
		gradBeta += (alpha / beta) - data[i];
	  } else {
		return [0, 0]; // Le gradient est nul si une valeur est négative ou nulle
	  }
	}
  
	return [gradAlpha, gradBeta];
  }
  
  // Fonction pour calculer la fonction digamma
  function digammaFunction(x) {
	const digammaCoefficients = [
	  -1 / 12, 1 / 120, -1 / 252, 1 / 240, -1 / 132,
	  691 / 32760, -1 / 12, 3617 / 8160, -43867 / 14364, 174611 / 6600
	];
	
	x -= 1;
	let result = Math.log(x) + 0.57721566490153286060651209; // Euler's constant
  
	for (let i = 0; i < 10; i++) {
	  result -= digammaCoefficients[i] / (x + i);
	}
  
	return result;
  }

  
  // Estimation des paramètres alpha (shape) et beta (scale) d'une distribution gamma sans critère d'arrêt
  function estimateur2_Gamma(data) {
	const initialAlpha = 5; // Valeur initiale de alpha
	const initialBeta = 5; // Valeur initiale de beta
	const learningRate = 0.001; // Taux d'apprentissage de la descente de gradient
	const maxIterations = 50000; // Nombre maximal d'itérations
	const tolerance = 0.0001;
	let alpha = initialAlpha;
	let beta = initialBeta;
  
	for (let i = 0; i < maxIterations; i++) {
	  	const [gradAlpha, gradBeta] = gradientGamma(data, alpha, beta);
		
	  	alpha += learningRate * gradAlpha;
		beta += learningRate * gradBeta;
		// Calculer la norme du gradient pour le critère d'arrêt
		const gradientNorm = Math.sqrt(gradAlpha * gradAlpha + gradBeta * gradBeta);
		console.log(alpha, beta);
	  	if(gradientNorm < tolerance)
		{
			console.log(`Convergence atteinte après ${i + 1} itérations.`);
		break; // Sortir de la boucle si le critère d'arrêt est satisfait
		}
	}
  
	return [alpha, beta];
  }



/*Loi de Weibull */
// Fonction de gradient de la log-vraisemblance pour une distribution normale
function gradient_weibull(data, a, b) {
	let gradA = 0;
	let gradB = 0;
	for (let i = 0; i < data.length; i++) {
		gradA += (1/a)+Math.log(data[i]/b)-Math.log(data[i]/b)*(data[i]/b)^(a);
		gradB += ((data[i]/b)^(a))*(a/b)-(1/b)
	  }
	return [gradA, gradB];
  }
  
  // Estimation des paramètres mean (moyenne) et stdDev (écart type) par la descente de gradient
  function estimateur2_weibull(data) {
	const initialA = 3.0; // Valeur initiale a
const initialB = 1.0; // Valeur initiale de b
const learningRate = 0.0001; // Taux d'apprentissage de la descente de gradient
const iterations = 50000; // Nombre d'itérations de la descente de gradient
	const tolerance = 0.0001;
	let a = initialA;
	let b = initialB;
	let grad=0;
	for (let i = 0; i < iterations; i++) {
	  const [gradA, gradB] = gradient_weibull(data, a, b);
	  a += learningRate * gradA;
	  b += learningRate * gradB;
		grad=Math.sqrt(gradA*gradA+gradB*gradB);
		if(grad < tolerance)
		{
			console.log(`Convergence atteinte après ${i + 1} itérations.`);
			break;
		}
	}
  
	return [a, b];
  }
  ///////////////////////////////////////////////////