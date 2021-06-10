--
-- Name: favoris; Type: TABLE; 
--

CREATE TABLE favoris (
    coureur integer NOT NULL,
    "user" character varying(40) NOT NULL
);


--
-- Name: favoris favoris_pkey; Type: CONSTRAINT; 
--

ALTER TABLE ONLY favoris
    ADD CONSTRAINT favoris_pkey PRIMARY KEY (coureur, "user");


--
-- Name: favoris favoris_coureur_fkey; Type: FK CONSTRAINT; 
--

ALTER TABLE ONLY favoris
    ADD CONSTRAINT favoris_coureur_fkey FOREIGN KEY (coureur) REFERENCES coureurs(dossard);


--
-- Name: favoris favoris_user_fkey; Type: FK CONSTRAINT; 
--

ALTER TABLE ONLY favoris
    ADD CONSTRAINT favoris_user_fkey FOREIGN KEY ("user") REFERENCES s8_users(login);
