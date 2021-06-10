<?php
class DataLayer {
	// private ?PDO $conn = NULL; // le typage des attributs est valide uniquement pour PHP>=7.4

	private  $connexion = NULL; // connexion de type PDO   compat PHP<=7.3
	
	/**
	 * @param $DSNFileName : file containing DSN 
	 */
	function __construct(string $DSNFileName){
		$dsn = "uri:$DSNFileName";
		$this->connexion = new PDO($dsn);
		// paramètres de fonctionnement de PDO :
		$this->connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // déclenchement d'exception en cas d'erreur
		$this->connexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // fetch renvoie une table associative
		// réglage d'un schéma par défaut :
		$this->connexion->query('set search_path=communes_mel, authent');
	}

	function authentification(string $login, string $password) : ?Identite{ // version password hash
        // à compléter
        $sql = <<<EOD
        select login, nom, prenom, password
        from users
        where login = :login
EOD;
        // $hashedPassword = password_hash($password,  CRYPT_BLOWFISH); // le mdp est cryptee avec blowfish et apres on le cherche ds la bdd
        $stmt = $this->connexion->prepare($sql);
        $stmt->bindValue('login', $login);
        // $stmt->bindValue('password', $hashedPassword);
        $stmt->execute();
        $res = $stmt->fetch(); // renvoie une table assoc ou False
        if ($res) {
            $empreinteStockee = $res['password'];
            if(crypt($password, $empreinteStockee) == $empreinteStockee) {
                return new Identite($res['login'], $res['nom'], $res['prenom']);
            } else {
                return NULL;
            }
            
        } else {
            return NULL;
        }
    }
    /**
    * @return bool indiquant si l'ajout a été réalisé
    */
    function createUser(string $login, string $password, string $nom, string $prenom) : bool	 {
        $sql = <<<EOD
        insert into "users" (login, password, nom, prenom)  
        values (:login, :password, :nom, :prenom)
EOD;
    $password = password_hash($password, CRYPT_BLOWFISH);//le mdp devient une empreinte :)
    $stmt = $this->connexion->prepare($sql);
    $stmt->bindValue('login', $login);
    $stmt->bindValue('password', $password);
    $stmt->bindValue('nom', $nom);
    $stmt->bindValue('prenom', $prenom);
    try {
        $stmt->execute(); // en cas de violation des contraintes
        // -> déclenchement d'un exception
        return $stmt->rowCount() == 1; // renvoie le nombre de
        // ligne affectées pas la dernière requete
    } catch (PDOException $e) {
        return false;
    }
    }
    
	/**
	 * Liste des territoires
	 * @return array tableau de territoires
	 * chaque territoire comporte les clés :
		* id (identifiant, entier positif),
		* nom (chaîne),
		* min_lat (latitude minimale, flottant),
		* min_lon (longitude minimale, flottant),
		* max_lat, max_lon
	 */
	// this is called in services.getTerritoires.php
	function getTerritoires(): array {
		$sql = "select id, nom , min_lat, min_lon, max_lat, max_lon from territoires join bb_territoires on id=territoire";
		//*** where is bb_territoires???
		$stmt = $this->connexion->prepare($sql);
		$stmt->execute();
		$res= $stmt->fetchAll();
		return $res;
	}
	
	/**
	 * Liste de communes correspondant à certains critères
	 * @param territoire : territoire des communes cherchées
	 * @return array tableau de communes (info simples)
	 * chaque commune comporte les clés :
		* insee (chaîne),
		* nom (chaîne),
		* lat, lon 
		* min_lat (latitude minimale, flottant),
		* min_lon (longitude minimale, flottant),
		* max_lat, max_lon
	 */
	// this is called in services/getCommunes.php
	function getCommunes(?int $territoire=NULL, ?string $nom = NULL, ?int $surface_min = NULL, ?int $pop_min = NULL): array {
		// synthese changement dans la requete
		$sql = <<<EOD
		select communes_mel.communes.insee, nom, lat, lon, min_lat, min_lon, max_lat, max_lon, surface, pop_totale
		from communes_mel.communes
		right join 
		(
			SELECT * FROM communes_mel.population WHERE recensement = 2016 ORDER BY insee DESC
		) recensement_2016
		on communes_mel.communes.insee = recensement_2016.insee
		left join communes_mel.bb_communes on communes_mel.bb_communes.insee = communes_mel.communes.insee
				
EOD;
		$conds =[];  // tableau contenant les code SQL de chaque condition à appliquer
		$binds=[];   // association entre le nom de pseudo-variable et sa valeur
		if ($territoire !== NULL){
			// foreach($territoire as $tr){
			// 	$conds[] .= "territoire = :territoire";
			// 	$binds[':territoire'] = $tr;
			// }
			$conds[] .= "territoire = :territoire";
			$binds[':territoire'] = $territoire;
		}
		if ($nom !== NULL){
			$conds[] .= "nom ILIKE :nom";
			$binds[':nom'] = "%$nom%";
		}
		if ($surface_min !== NULL){
			$conds[] .= "surface > :surface_min";
			$binds[':surface_min'] = $surface_min;
		}
		if ($pop_min !== NULL){
			$conds[] .= "pop_totale > :pop_min";
			$binds[':pop_min'] = $pop_min;
		}
		if (count($conds)>0){ // il ya au moins une condition à appliquer ---> ajout d'ue clause where
			$sql .= " where ". implode(' and ', $conds); // les conditions sont reliées par AND
			//*** only one condition is passed at a time so why the implode?? why not just concatinate??
		}
		$stmt = $this->connexion->prepare($sql);
		$stmt->execute($binds);
		$res = $stmt->fetchAll() ;
		return $res;
	}
	
	
	/**
	 * Information détaillée sur une commune
	 * @param insee : code insee de la commune
	 * @return commune ou NULL si commune inexistante
	 * l'objet commune comporte les clés :
	 *	insee, nom, nom_terr, surface, perimetre, pop2016, lat, lon, geo_shape
	 */
	// this is called in services/getDetails.php
	function getDetails(string $insee): ?array {
		$sql = <<<EOD
			select insee, communes.nom, territoires.nom as nom_terr, surface, perimetre, population.pop_totale as pop2016,
			lat, lon, geo_shape   from communes 
			join communes_mel.territoires on id=territoire
			natural left join communes_mel.population
			where (recensement=2016 or recensement is null) and insee=:insee
EOD;
		$stmt = $this->connexion->prepare($sql);
		$stmt->execute([':insee'=>$insee]);
		$res= $stmt->fetch() ;
		return $res ? $res : NULL;
	}


}
?>
