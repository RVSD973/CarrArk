# CarrArk Navigator

Le CarrArk Navigator est un outil open source permettant de marquer et de partager des emplacements de surface dans Star Citizen. En attendant l'implémentation dans la Starmap du stockage et partage de Point d'interêt. Chaque planète et chaque lune disposent de marqueurs orbitaux (OM 1 à 6) qui sont géostationnaires et peuvent être utilisés pour la navigation. Cela nous donne un moyen de stocker notre position en enregistrant la distance jusqu'aux 3 points OM les plus proches. Cela fonctionne, mais retrouver son chemin en utilisant ces distances peut être frustrant.

Cet outil est tout simplement une amélioration du Nova Navigator (consultez l'historique ci-dessous), ces améliorations sont centrés sur sa simplification d'utilisation au profit de la communauté francophone (traduction, ajout d'un menu Aide, personnalisation des couleurs) . N'hésitez pas à copier, modifier et héberger votre propre version de cet outil. Il s'agit d'un site statique, il devrait donc être facile à implémenter dans un projet existant.

### Live Examples

- [Daymar - Constellation Wreck](https://carrark.rvsd.fr/?title=Daymar%20-%20Constellation%20Wreck&distance=430&om2=486.5&om3=460.7&om5=168.4&size=295.2)
- [Clio - Starfarer Wreck](https://carrark.rvsd.fr/?title=Clio%20-%20Starfarer%20Wreck&om1=294.9&om3=208.6&om5=397.8&size=240&distance=352.2)
- [Lyria - Paradise Cove](https://carrark.rvsd.fr/?title=Lyria%20-%20Paradise%20Cove&om2=347.8&om3=166.6&om6=316.6&size=223&distance=328.2)
- [Magda - Caterpillar Wreck](https://carrark.rvsd.fr/?title=Magda%20-%20Caterpillar%20Wreck&om1=550.2&om3=516.8&om5=205.3&size=341&distance=494.8)
- Create your own at: https://carrark.rvsd.fr

### Navigation example
![Navigation example](image/example-screenshot-1.png "Navigation example")

### Editor example
![Editor example](image/example-screenshot-2.png "Editor example")

## History

En 2019 (à peu près ?), je pensais calculer des itinéraires vers un emplacement de surface que vous pourriez suivre en vous rendant toujours à un point visible. J'ai commencé à chercher et j'ai découvert que [PandaBot](https://robertsspaceindustries.com/citizens/Pandabot) venait de publier quelque chose de similaire : https://pandabotz.github.io/sc-route-calc/ . Génial ! Je travaillais sur le Nova Trade Calculator à cette époque et je n'avais pas de temps à consacrer à d'autres projets, j'ai donc commencé à utiliser cet outil pour mes besoins de navigation.

Un peu plus tard, j'ai eu une discussion sur Discord avec [LordSkippy](https://robertsspaceindustries.com/citizens/LordSkippy) et il a également été séduit par l'idée de créer quelque chose comme cet outil. Il a commencé à travailler sur https://verseguide.com . Cela s'est avéré génial (sérieux, jetez-y un œil), mais c'était un peu trop élaboré à mon goût. Je voulais juste un outil compact pour marquer (et peut-être partager) des emplacements, de préférence en utilisant mon téléphone.

C'est pourquoi [SandovalBurrows](https://robertsspaceindustries.com/citizens/SandovalBurrows) @ [NOVA Intergalactic](https://novaintergalactic.com/) a décidé de commencer à travailler sur ce projet. À l'époque, il jouais avec Threejs et il a décidé de l'utiliser pour la visualisation. Un avantage supplémentaire était qu'il pouvais utiliser leur logique 3D pour garder ses mathématiques aussi simples que possible et déboguer sa logique visuellement. Il a mis au point un algorithme assez solide et qui est utiliser depuis quelques année maintenant.

Afin de rendre encore plus simple d'utilisation au profit la communauté francophone et plus précisemment notre organisation SIBYLLA, j'ai décidé d'améliorer ce travail que je trouve magnifique afin surtout de le rendre plus simple d'utilisation. Cette amélioration est passé par une traduction FR des instructions, l'ajout d'un bouton d'aide et une petite personnalisation des couleurs. 

-- [Joe-Caire](https://robertsspaceindustries.com/citizens/Joe-Caire) @ [Sibylla](https://sibyllasc.fr/)


To contact me on Discord: SandovalBurrows#4256

## License

This project is licensed under CC BY 4.0.

**You are free to:**

- Share — copy and redistribute the material in any medium or format.
- Adapt — remix, transform, and build upon the material for any purpose, even commercially.

**Under the following terms:**

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
