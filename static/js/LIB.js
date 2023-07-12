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
	let Stats = Object.create(null);
	Stats["nombre d'observation"]= data.length;
	Stats["minimum"]= Math.min(...data);
	Stats["maximum"]=Math.max(...data);
	Stats["moyenne"]=Moments_r(data,1).toFixed(4);
	Stats["variance"]=Moments_centre_r(data,2).toFixed(4);
	
	// skewness
	let m3=Moments_centre_r(data,3);
	let m23=Math.pow(Moments_centre_r(data,2), 1.5)
	
	Stats["skewness"]=(m3/m23).toFixed(4);
	
	// kurtosis
	let m4=Moments_centre_r(data,4);
	let m22=Math.pow(Moments_centre_r(data,2), 2);
	Stats["kurtosis"]=(-3+m4/m22).toFixed(4);
 
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

function echantillonNormale(mu, sigma, taille) {
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
	
    const echantillon = mu + sigma * x;
    echantillons.push(x);
	console.log(echantillon);
  }
  console.log(echantillons);
  return echantillons;
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
  

function echantillonsGamma(alpha, beta, taille) {
  const echantillons = [];

  for (let i = 0; i < taille; i++) {
    let echantillon = 0;
    for (let j = 0; j < beta; j++) {
      const u = Math.random();
      echantillon -= Math.log(u);
    }
    echantillon /= alpha;
    echantillons.push(echantillon);
  }

  return echantillons;
}

///////////////////////////////////////////////////