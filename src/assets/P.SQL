CREATE DEFINER = `root` @`localhost` PROCEDURE `psAuditeur_AssiduiteReg`(_idere int) BEGIN
SELECT
    a.id as idauditeur,
    a.matricule,
    a.nom as nomauditeur,
    a.prenom as auditeur,
    null as observations,
    0 as present,
    0 as `valide`,
    null as `datejour`,
    null as retard,
    0 as justifie
FROM
    auditeurs a
INNER JOIN auditeurregroupement r ON a.id = r.idaudi
INNER JOIN regroupementparcours p ON p.idreg = r.idreg
INNER JOIN coursprogramme c ON c.idregroupements = r.idreg
AND c.idparcours = p.idparc
WHERE
    r.idreg = _idere;

END