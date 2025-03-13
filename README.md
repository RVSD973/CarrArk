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

En 2019 (à peu près ?), [SandovalBurrows](https://robertsspaceindustries.com/citizens/SandovalBurrows) @ [NOVA Intergalactic](https://novaintergalactic.com/) pensait calculer des itinéraires vers un emplacement de surface qu'il pourrait suivre en se rendant toujours à un point visible. Il a commencé à chercher et a découvert que [PandaBot](https://robertsspaceindustries.com/citizens/Pandabot) venait de publier quelque chose de similaire : https://pandabotz.github.io/sc-route-calc/ . Génial ! Il travaillait sur le Nova Trade Calculator à cette époque et il n'avais pas de temps à se consacrer à d'autres projets, il donc commencé à utiliser cet outil pour ses besoins de navigation.

Un peu plus tard, il a eu une discussion sur Discord avec [LordSkippy](https://robertsspaceindustries.com/citizens/LordSkippy) qui a également été séduit par l'idée de créer quelque chose comme cet outil. [LordSkippy](https://robertsspaceindustries.com/citizens/LordSkippy) a commencé à travailler sur https://verseguide.com. Cela s'est avéré génial (Un outil devenu un indispensable des explorateurs, jetez-y un œil). Un peu trop élaboré pour [SandovalBurrows](https://robertsspaceindustries.com/citizens/SandovalBurrows), il voulais juste un outil compact pour marquer (et peut-être partager) des emplacements, de préférence en utilisant son téléphone.

C'est pourquoi [SandovalBurrows](https://robertsspaceindustries.com/citizens/SandovalBurrows) a décidé de commencer à travailler sur ce projet [NOVA Navigator](https://nova-public.gitlab.io/navigator/). À l'époque, il jouais avec Threejs et il a décidé de l'utiliser pour la visualisation. Un avantage supplémentaire était qu'il pouvais utiliser leur logique 3D pour garder ses mathématiques aussi simples que possible et déboguer sa logique visuellement. Il a mis au point un algorithme assez solide et qui est utiliser depuis quelques année maintenant.

Afin de rendre encore plus simple d'utilisation au profit de la communauté francophone et plus précisemment notre organisation SIBYLLA, j'ai décidé d'améliorer ce travail que je trouve magnifique afin surtout de le rendre plus simple d'utilisation (pour les non-inités). Cette amélioration est passé par une traduction FR des instructions, l'ajout d'un bouton d'aide, l'ajout de Pyro et ces lunes et une petite personnalisation des couleurs. 

-- [Joe-Caire](https://robertsspaceindustries.com/citizens/Joe-Caire) @ [Sibylla](https://sibyllasc.fr/)

Un grand merci à [SandovalBurrows](https://robertsspaceindustries.com/citizens/SandovalBurrows) @ [NOVA Intergalactic](https://novaintergalactic.com/) pour la souche très prometteuse de son travail. Et aussi tous les autres créateurs de contenu du genre :

 - ([LordSkippy](https://robertsspaceindustries.com/citizens/LordSkippy) @ [Verseguide](https://verseguide.com/)
 - [Murphy "(ItsjustmeMurphy)"](https://docs.google.com/spreadsheets/d/1aGJ0_49ve1NKf0GvSteSt3-a4jSxnj2snHmTDwKTBgs/edit?gid=1238406064#gid=1238406064) 

## License

CarrArk Navigator de Joe-Caire est sous licence CC BY 4.0. Pour voir une copie de cette licence, visitez http://creativecommons.org/licenses/by/4.0/


Le code est disponible : https://github.com/JoeCaire/CarrArk

Vous êtes libre de :

Partager — copier et redistribuer le matériel sur n’importe quel support ou format à n’importe quelle fin, même commerciale.
Adaptez — remixez, transformez et développez le matériel à toutes fins, même commerciales.

Le concédant ne peut pas révoquer ces libertés tant que vous respectez les termes de la licence.

Selon les conditions suivantes :

Attribution — Vous devez créditer l'œuvre de manière appropriée , fournir un lien vers la licence et indiquer si des modifications ont été apportées . Vous pouvez le faire de toute manière raisonnable, mais pas d'une manière qui suggère que le concédant de licence vous approuve ou approuve votre utilisation.

Aucune restriction supplémentaire — Vous ne pouvez pas appliquer de conditions juridiques ou de mesures technologiques qui restreignent légalement les autres à faire tout ce que la licence autorise.


Avis :
Vous n'êtes pas tenu de respecter la licence pour les éléments du matériel qui sont dans le domaine public ou dont l'utilisation est autorisée par une exception ou une limitation applicable .

Aucune garantie n'est donnée. La licence peut ne pas vous donner toutes les autorisations nécessaires à l'utilisation que vous souhaitez en faire. Par exemple, d'autres droits tels que les droits de publicité, de confidentialité ou les droits moraux peuvent limiter la manière dont vous utilisez le matériel.
