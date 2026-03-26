import StoreManagementDataTable from './GenieRequestsDataTable';

const GenieRequestsMainComp = () => {
  return (
    <>
      <div className="dashboard-content-wrap">
        <div className="d-full-card-wrap">
          <div className="data-table-wrap">
            <StoreManagementDataTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default GenieRequestsMainComp;
