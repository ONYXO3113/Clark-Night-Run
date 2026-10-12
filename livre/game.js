/* ============================================================
   CLARK: NIGHT RUN — logique du livre-jeu
   ============================================================ */
(function () {
  'use strict'

  var CLE = 'clark_night_run_livre'
  var VEHICULES = { porsche: 'Porsche 911 Turbo S', corolla: 'Toyota Corolla', ram: 'Dodge Ram' }

  var STATS = {
    heat: { nom: 'Alerte', signe: true },
    damage: { nom: 'Dégâts', signe: true },
    danger: { nom: 'Danger', signe: true },
    reputation: { nom: 'Réputation' },
    money: { nom: 'Argent' },
    fuel: { nom: 'Carburant' },
    secrets: { nom: 'Secrets' },
    trust_maya: { nom: 'Maya' },
    trust_rocco: { nom: 'Rocco' },
    trust_elias: { nom: 'Elias' },
  }

  /* ---------- memoire ---------- */

  function lire() {
    try {
      var brut = window.localStorage.getItem(CLE)
      if (!brut) return { vehicule: '', stats: {}, parcours: [], fins: [], debut: Date.now() }
      var d = JSON.parse(brut)
      return {
        vehicule: d.vehicule || '',
        stats: d.stats || {},
        parcours: d.parcours || [],
        fins: d.fins || [],
        debut: d.debut || Date.now(),
      }
    } catch (e) {
      return { vehicule: '', stats: {}, parcours: [], fins: [], debut: Date.now() }
    }
  }

  function ecrire(d) {
    try { window.localStorage.setItem(CLE, JSON.stringify(d)) } catch (e) { /* mode prive */ }
  }

  function maj(modifs) {
    var d = lire()
    if (modifs.vehicule !== undefined) d.vehicule = modifs.vehicule
    if (modifs.fin !== undefined && d.fins.indexOf(modifs.fin) === -1) d.fins.push(modifs.fin)
    if (modifs.page && d.parcours.indexOf(modifs.page) === -1) d.parcours.push(modifs.page)
    ecrire(d)
    return d
  }

  function sansAccents(t) {
    return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  function prix(n) {
    return n > 0 ? '+' + n : String(n)
  }

  /* ---------- conditions ---------- */

  function conditionVerifiee(c) {
    if (!c) return true
    var d = lire()
    var v = d.stats
    switch (c.type) {
      case 'vehicle':       return d.vehicule === c.value
      case 'secrets_min':   return (v.secrets || 0) >= c.value
      case 'heat_min':      return (v.heat || 0) >= c.value
      case 'heat_max':      return (v.heat || 0) <= c.value
      case 'damage_min':    return (v.damage || 0) >= c.value
      case 'damage_max':    return (v.damage || 0) <= c.value
      case 'reputation_min':return (v.reputation || 0) >= c.value
      case 'money_min':     return (v.money || 0) >= c.value
      case 'trust_maya_min':return (v.trust_maya || 0) >= c.value
      case 'trust_rocco_min':return (v.trust_rocco || 0) >= c.value
      case 'trust_elias_min':return (v.trust_elias || 0) >= c.value
      case 'flag':          return true
      default:              return true
    }
  }

  function raison(c) {
    if (!c) return ''
    var d = lire()
    if (c.type === 'vehicle') {
      return 'Réservé au véhicule ' + (VEHICULES[c.value] || c.value) + ' — tu es en ' + (VEHICULES[d.vehicule] || 'cours de route') + '.'
    }
    var s = STATS[c.type.replace(/_min$/, '')]
    return 'Il te faut ' + (s ? s.nom : c.type) + ' ' + c.value + ' ou plus.'
  }

  /* ---------- affichage ---------- */

  function afficherStats() {
    var zone = document.querySelector('[data-stats]')
    if (!zone) return
    var d = lire()
    var ordre = ['heat', 'damage', 'reputation', 'secrets', 'money', 'trust_maya', 'trust_rocco', 'trust_elias']
    var html = ''
    ordre.forEach(function (cle) {
      var brut = d.stats[cle] || 0
      if (cle !== 'heat' && cle !== 'damage' && cle !== 'reputation' && cle !== 'secrets' && brut === 0) return
      var s = STATS[cle]
      html += '<li>' + s.nom + ' <b>' + brut + '</b>' + (brut !== 0 ? ' (' + prix(brut) + ')' : '') + '</li>'
    })
    zone.innerHTML = html || '<li>Aucune statistique modifiee</li>'
  }

  function afficherVehicule() {
    var d = lire()
    document.querySelectorAll('[data-nom-vehicule]').forEach(function (el) {
      el.textContent = d.vehicule ? VEHICULES[d.vehicule] : 'Aucun vehicule'
    })
  }

  function afficherParcours() {
    var el = document.querySelector('[data-parcours]')
    if (!el) return
    var n = lire().parcours.length
    el.textContent = n > 0 ? n + ' page(s) parcourue(s)' : 'Aucune page parcourue'
  }

  function afficherFins() {
    var trouvees = lire().fins
    document.querySelectorAll('[data-fin-etat]').forEach(function (el) {
      var num = el.getAttribute('data-fin-etat')
      var ok = trouvees.indexOf(num) !== -1
      el.textContent = ok ? 'DECOUVERTE' : 'INCONNUE'
      el.className = 'etat-fin ' + (ok ? 'etat-fin--ok' : 'etat-fin--non')
    })
    var total = document.querySelector('[data-fin-total]')
    if (total) total.textContent = trouvees.length
  }

  /* ---------- vehicule ---------- */

  function initVehicules() {
    document.querySelectorAll('a[data-vehicule]').forEach(function (a) {
      a.addEventListener('click', function () {
        var d = maj({ vehicule: a.getAttribute('data-vehicule') })
        d.parcours = []
        ecrire(d)
      })
    })
  }

  /* ---------- choix ---------- */

  function initChoix() {
    document.querySelectorAll('a[data-choix]').forEach(function (a) {
      var condition = null
      try { condition = JSON.parse(a.getAttribute('data-condition') || 'null') } catch (e) { condition = null }

      if (!conditionVerifiee(condition)) {
        a.classList.add('lien--bloque')
        a.setAttribute('aria-disabled', 'true')
        var info = document.createElement('span')
        info.className = 'raison-blocage'
        info.textContent = 'VERROUILLE — ' + raison(condition)
        a.appendChild(info)
        a.addEventListener('click', function (e) { e.preventDefault() })
        return
      }

      a.addEventListener('click', function () {
        var effets = null
        try { effets = JSON.parse(a.getAttribute('data-effets') || 'null') } catch (e) { effets = null }
        var d = lire()
        if (effets) {
          Object.keys(effets).forEach(function (cle) {
            d.stats[cle] = (d.stats[cle] || 0) + effets[cle]
          })
        }
        d.choix = d.choix || []
        d.choix.push(a.getAttribute('data-choix'))
        ecrire(d)
      })
    })
  }

  /* ---------- fins ---------- */

  function initFins() {
    var num = document.body.getAttribute('data-fin')
    if (num) maj({ fin: num })
  }

  function initReinitialisation() {
    document.querySelectorAll('[data-reinitialiser]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { window.localStorage.removeItem(CLE) } catch (e) { /* ignore */ }
      })
    })
  }

  /* ---------- mini-jeu : le barrage ---------- */

  function initMiniJeu() {
    var racine = document.querySelector('[data-minijeu]')
    if (!racine) return

    var terrain = racine.querySelector('.minijeu-cible')
    var message = racine.querySelector('.minijeu-message')
    var jauge = racine.querySelector('[data-jauge] > i')
    var duree = Number(racine.getAttribute('data-duree') || 20)
    var cibles = []

    var liens = document.querySelectorAll('[data-minijeu-suite]')
    liens.forEach(function (l) { l.classList.add('lien--verrou') })

    function dire(txt) { if (message) message.innerHTML = txt }

    function direEchec() {
      dire('<b>Tu n\'as pas tenu.</b> Quelqu\'un a franchi la ligne. Le barrage tient sans toi.')
      racine.setAttribute('data-etat', 'defaite')
      liens.forEach(function (l) {
        if (l.getAttribute('data-minijeu-suite') === 'defaite') l.classList.remove('lien--verrou')
      })
    }

    function direVictoire() {
      dire('<b>Barrage tenu.</b> Vingt secondes. Personne n\'a franchi la ligne.')
      racine.setAttribute('data-etat', 'victoire')
      liens.forEach(function (l) {
        if (l.getAttribute('data-minijeu-suite') === 'victoire') l.classList.remove('lien--verrou')
      })
    }

    if (!terrain) return

    function apparaitre() {
      var progression = Math.min(1, (Date.now() - depart) / (duree * 1000))
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'cible'
      b.setAttribute('aria-label', 'Gyrophare')
      b.style.left = (30 + Math.random() * 40) + '%'
      var lueur = document.createElement('span')
      lueur.className = 'cible-gyrophare'
      var tete = document.createElement('span')
      tete.className = 'cible-tete'
      var corps = document.createElement('span')
      corps.className = 'cible-corps'
      b.appendChild(corps)
      b.appendChild(tete)
      b.appendChild(lueur)
      b.addEventListener('click', function (e) {
        e.stopPropagation()
        if (b.classList.contains('cible--ok')) return
        b.classList.add('cible--ok')
        var i = cibles.indexOf(b)
        if (i !== -1) cibles.splice(i, 1)
        score++
      })
      terrain.appendChild(b)
      cibles.push({
        el: b,
        avancement: 0,
        vitesse: 0.05 + progression * 0.055 + Math.random() * 0.028,
      })
    }

    function placer(c) {
      // avancement 0 = loin au fond de la rue, 1 = la ligne rouge du joueur.
      var distance = (1 - c.avancement) * (terrain.clientHeight * 0.82)
      c.el.style.bottom = distance + 'px'
      var taille = 0.55 + c.avancement * 0.45
      c.el.style.transform = 'scale(' + taille.toFixed(3) + ')'
      c.el.style.zIndex = String(100 - Math.floor(c.avancement * 50))
    }

    function boucler() {
      var maintenant = Date.now()
      var ecoule = (maintenant - depart) / 1000
      var progression = Math.min(1, (maintenant - depart) / (duree * 1000))

      if (jauge) jauge.style.width = (progression * 100).toFixed(1) + '%'
      if (chrono) chrono.textContent = Math.max(0, Math.ceil(duree - ecoule)) + ' s'
      if (marque) marque.textContent = score + ' touche(s)'

      if (progression >= 1) {
        direVictoire()
        return
      }

      var suivant = 1.5 - progression * 0.95
      if (maintenant - dernier >= suivant * 1000) {
        dernier = maintenant
        apparaitre()
      }

      var restant = []
      for (var i = 0; i < cibles.length; i++) {
        var c = cibles[i]
        c.avancement += c.vitesse * 0.05
        if (c.avancement >= 1) {
          direEchec()
          return
        }
        placer(c)
        restant.push(c)
      }
      cibles = restant

      requestAnimationFrame(boucler)
    }

    var depart = Date.now()
    var dernier = 0
    var score = 0
    var chrono = racine.querySelector('[data-chrono]')
    var marque = racine.querySelector('[data-score]')

    dire('Clique sur les gyrophares pour les faire reculer. Un agent qui atteint la ligne rouge et la nuit est finie.')
    apparaitre()
    requestAnimationFrame(boucler)
  }

  /* ---------- demarrage ---------- */

  function demarrer() {
    maj({ page: document.body.getAttribute('data-page') || '' })
    initVehicules()
    initChoix()
    initFins()
    // L'affichage se fait apres l'enregistrement : une page de fin doit
    // deja se compter elle-meme dans le compteur.
    afficherStats()
    afficherVehicule()
    afficherParcours()
    afficherFins()
    initReinitialisation()
    initMiniJeu()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer)
  } else {
    demarrer()
  }

  window.ClarkLivre = { lire: lire, reinitialiser: function () { try { window.localStorage.removeItem(CLE) } catch (e) {} } }
})()
