import React, { useEffect, useState, useCallback } from 'react'
import { ProgressBar, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { GET_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT_STATUS } from '../../actions/product';
import _ from 'lodash';
import ReactPagination from '../general/ReactPagination'
import DeleteModal from '../general/DeleteModal';
import Switch from "react-switch";
import { Field, Formik, Form } from "formik";
import * as Yup from 'yup';

const Product = () => {

  const page = useSelector((state) => state.product.page);
  const totalData = useSelector((state) => state.product.total);
  const limit = useSelector((state) => state.product.limit);
  const totalPages = useSelector((state) => state.product.totalPages);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityID, setActivityId] = useState('');

  const [intialValue, setInitialValue] = useState({
    packageName: ''
  });

  const personalInfo = Yup.object().shape({
    packageName: Yup.string().required('package name must required !!')
  })

  const updateProfile = useCallback((values) => {
    getProduct({search:values.packageName});
  })

  // const searchApplication = useCallback((values) => {
  //   getProduct({search:values});
  // })

  const handleCloseDeleteModel = () => {
    setShowDeleteModal(false);
    setActivityId('');
  };

  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.userProduct);
  // console.log('products ==>', products);

  const getProduct = useCallback((data = {}) => {
    dispatch({ type: GET_PRODUCT, payload: data });
  }, []);

  const handlePageClick = useCallback(
    (page) => {
      const data = {
        page: page.selected + 1,
      };
      getProduct(data);
    }, []);

  useEffect(() => {
    getProduct();
  }, []);

  const deleteActivity = useCallback(
    () =>
      dispatch({
        type: DELETE_PRODUCT,
        payload: activityID,
        cb: (res) => {
          if (_.get(res, 'status', '') === DELETE_PRODUCT) {
            handleCloseDeleteModel();
          }
        },
      }),
    [activityID]
  );

  const handleChange = (productId, status)=>{
    let data = { status: !status, id: productId }
    dispatch({ type: UPDATE_PRODUCT_STATUS, payload: data })
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Applications </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Applications List</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Search Application</h4>
                    <Formik
                        initialValues={intialValue}
                        enableReinitialize
                        validationSchema={personalInfo}
                        onSubmit={(values, { setSubmitting }) => {
                          setSubmitting(false)
                          updateProfile(values);
                        }}>
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            isSubmitting,
                        }) =>
                        (
                            <Form onSubmit={handleSubmit} className="mt-4">
                                <div className='row'>
                                    <div className='col-md-8'>
                                        <div className='form-group'>
                                            <label id="MainLabel"> Package Name </label>
                                            <Field
                                                className='form-control'
                                                type='text'
                                                name='packageName'
                                                placeholder=' Enter package name'
                                                // onChange = {(e)=>searchApplication(e.target.value)}
                                            />
                                            {errors.packageName && touched.packageName ? (
                                                <div style={{ color: 'rgb(220,37,43)', marginTop: 3 }}>{errors.packageName}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='col-md-4 mt-3'>
                                      <label id="MainLabel"> &nbsp; </label>
                                      <Button type="submit" className="update-btn" disabled={isSubmitting}>
                                        Search
                                      </Button>
                                    </div>
                                </div>
                                
                            </Form>
                        )}
                    </Formik>

                    {/* <form className="form-sample">
                        <p className="card-description"> Personal info </p>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">First Name</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text"
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Last Name</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" />
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Gender</label>
                                    <div className="col-sm-9">
                                        <select className="form-control">
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Date of Birth</label>
                                    <div className="col-sm-9">
                                        <DatePicker className="form-control w-100"
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Image</label>
                                    <div className="col-sm-9">
                                        <div className="custom-file">
                                            <Form.Control type="file" className="form-control visibility-hidden" id="customFileLang" lang="es" />
                                            <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <p className="card-description"> Address </p>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Address 1</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" />
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">State 1</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" />
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Address 2</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" />
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Postcode</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" />
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Cirt</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" />
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Country</label>
                                    <div className="col-sm-9">
                                        <select className="form-control">
                                            <option>America</option>
                                            <option>Italy</option>
                                            <option>Russia</option>
                                            <option>Britain</option>
                                        </select>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                    </form> */}
                </div>
            </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">List</h4>
              <button className='btn btn-default'><Link to="/application/add" >Add Application</Link></button>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th> No </th>
                      <th> App Name </th>
                      <th> Package Name </th>
                      <th> Account Name </th>
                      <th> App Status </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.isEmpty(products) ? (
                      <tr>
                        <td colSpan={6} className="border-0">
                          <div className="empty-data-block">No Product</div>
                        </td>
                      </tr>
                    ) : (
                      _.map(products, (item, key) => {
                        return (
                          <tr key={`product-${key}`}>

                            <td className="py-1">
                              {(key + 1) + ((page - 1) * limit)}
                            </td>
                            <td>{_.get(item, 'name', '')}</td>
                            <td>{_.get(item, 'accountName', '')}</td>
                            <td>
                              {_.get(item, 'packageName', '')}
                            </td>
                            <td> 
                              {/* {(item.status) ? 'Live' : 'Suspend'}  */}
                              <Switch onChange={(e)=> handleChange(item.id, item.status)} checked={item.status} />
                            </td>
                            <td>
                              <Link to={`/application/${item.id}`} className='text text-warning'><FaEdit /> </Link>
                              <Link onClick={() => {
                                setShowDeleteModal(true);
                                setActivityId(_.get(item, 'id', ''));
                              }} className='text text-danger'> <FaTrash /></Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                <ReactPagination
                  currentPage={page}
                  limit={limit}
                  total={totalData}
                  handlePageClick={(pageVal) => handlePageClick(pageVal)}
                  totalPages={totalPages}
                  marginPagesDisplayed={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <Modal show={showDeleteModal} centered onHide={handleCloseDeleteModel}>
          <DeleteModal title="Product" onClose={handleCloseDeleteModel} onRemove={deleteActivity} />
        </Modal>
      )}
    </div>
  )
}

export default Product
