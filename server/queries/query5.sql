SELECT
  st.id,
  p.salutation,
  p.surname,
  p.other_names,
  p.box,
  p.postal_code,
  p.town,
  p.country,
  st.number_of_shares,
  stp.name
FROM ShareTransfer st
  INNER JOIN Person p
    ON st.transferee_id = p.id
  INNER JOIN ShareType stp
    ON st.share_type_id = stp.id
WHERE (st.company_id = 5)
      AND (st.transferer_type = 'company')
      AND (st.approved = 1)
      AND (
        DATE(st.createdAt) >= '2016-08-08' AND
        DATE(st.createdAt) <= '2017-08-31'
      )
ORDER BY p.surname