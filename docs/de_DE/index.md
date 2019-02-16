Description 
===

Ce plugin permet de créer des équipements qui lancent une ou plusieurs actions , des scénarios. Il est ainsi possible de créer un réveil, une horloge , un décompte à partir d'une date.

Installation
=============

Comme n'importe quel plugin.

Après l'avoir activer ,  il faut ensuite aller dans Plugins/Organisation/Task Launcher. Puis choisir le type d'équipement désiré.


Les widgets
===

- **Le Réveil**

**widget par défaut**

![clock0](../images/clock0.png)


**widget simple**

![clock05](../images/clock05.png)


**widget alternatif**

![task_4](../images/task_4.png)

- **L'horloge**

**Le widget par défaut**

![clock2](../images/clock2.png)


**Le widget de l'horloge digitale**

![hordigit](../images/hordigit.png)

- **Les événements**

![event1](../images/event1.png)



Utilisation
====

- ### **Les réveils**

**Configuration**


![rev1](../images/rev1.png)

Simple à configurer. Il faut définir l'heure (heure/minute) à laquelle vous voulez que les actions se lancent.Ensuite définir les actions souhaitées . Possible de définir des actions en différées.

> **INFOS**
>
> Il y a deux boutons pour définir les actions. L'un permet de choir un mot clé. L'autre de choisir une commande existante. 


**Commandes sur le widget**


> <span style="color:blue">**Après il est possible:**</span>


> **De désactiver la tâche en cliquant sur le check**

> **De changer l'heure d’exécution en cliquant sur le marteau**

> **De changer le(s) action(s) en cliquant sur les bars**

> **De Lancer le(s) action(s) en direct en cliquant sur le play**

> **De définir un temps de lancement en cliquant sur le cercle**

>**Sur le widget alternatif, possibilité de parametrer l'heure, les minutes,les jours et d'activer ou nom le reveil**


> <span style="color:red">**IMPORTANT**</span>

> **Il ne faut jamais activer un équipement entre l'heure différée et l'heure effective (cela aura pour effet de lancer toutes les actions**


**Utilisation des commandes dans les scénarios**

![command](../images/command.png)


> <span style="color:blue">**NOTE**</span>

> Il est possible d'activer/désactiver le réveil ou de changer l'heure d'éxécution depuis un autre scénario (Image ci-dessus)

> Il faut mettre l'heure au format 0720 pour 7h20 ou 1830 pour 18h30.


![tache6](../images/tache6.png)


> <span style="color:blue">**TIP**</span>

> Dans le cas suivant ,il est possible d'utiliser les fonctions incluses à jeedom. La tâche sera effectuée à #time# + rand(0,100) . Soit l'heure d’exécution du scénario + nombre aleatoire entre 0 et 100

![tache7](../images/tache7.png)


- ### **Horloge**

Cela permet de créer un horloge pour afficher sur le mode design par exemple

![clock20](../images/clock20.png)

Possibilité de choisir la taille et d'afficher ou non les secondes


- ### **Les événements**

Avec ce type d'équipement , on peux définir une date d'éxécution pour des actions/scénarios 

![event3](../images/event3.png)














