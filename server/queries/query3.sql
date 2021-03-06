# amount paid/unpaid on each allotted share --NonCash
SELECT
  st.id,
  st.number_of_shares,
  st.share_price,
  (st.number_of_shares * st.share_price) AS total_cost
FROM ShareTransfer st
  INNER JOIN SharePayment sp
    ON st.id = sp.share_transfer_id
       AND (sp.payment_type = 'NonCash')
WHERE (st.company_id = 5)
      AND (st.transferer_type = 'company')
      AND (st.approved = 1)
      AND (
        DATE(st.createdAt) >= '2016-08-08' AND
        DATE(st.createdAt) <= '2017-08-31'
      )
GROUP BY st.id
WITH ROLLUP