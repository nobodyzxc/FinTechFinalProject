const Pending    = 'pending';
const Accepted   = 'accepted';
const Canceled   = 'canceled';
const Finished   = 'finished';
const Customer   = 'customer';
const Restaurant = 'restaurant';
const History    = 'history';
var   HTMLDefs   = (webtype, reqname) => `
  <script>
    const Pending = '${Pending}';
    const Accepted = '${Accepted}';
    const Canceled = '${Canceled}';
    const Finished = '${Finished}';
    const Customer = '${Customer}';
    const Restaurant = '${Restaurant}';
    const History = '${History}';
    const Webtype = '${webtype}';
    const ReqName = '${reqname}';
  </script>`;

module.exports = {
  Pending :     Pending,
  Accepted :    Accepted,
  Canceled :    Canceled,
  Finished :    Finished,
  Customer :    Customer,
  Restaurant :  Restaurant,
  History :     History,
  HTMLDefs :    HTMLDefs
};
