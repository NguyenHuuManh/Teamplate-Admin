import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CInput, CInputGroup, CPagination, CRow } from '@coreui/react'
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react'
import { apiGetMembers, apiUnActiveMembers } from 'src/apiFunctions/orgManagerment'
import { calcItemStart, countPage } from 'src/helps/function';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { appToast } from 'src/views/components/AppToastContainer';
const size = 1;
const UserManager = () => {
    const [itemSelected, setItemSelected] = useState({});
    const [pageSize, setPageSize] = useState({ page: 1, size: size });
    const [sort, setSort] = useState(true);
    const [key, setKey] = useState("");
    const [data, setData] = useState({});

    const getUsers = (keySearch) => {
        const body = {
            pageSize: pageSize.size,
            pageIndex: pageSize.page - 1,
            sort: sort,
            search: keySearch,
        }
        apiGetMembers(body).then((e) => {
            console.log(e, "eEEE");
            if (e?.status == 200) {
                if (e.data.code == '200') {
                    setData(e.data.obj);
                }
            } else {

            }
        })
    };


    const debounceSearch = useCallback(debounce((key) => { setPageSize({ ...pageSize, page: 0, size: size }) }, 500), []);

    const onChange = (values) => {
        setKey(values.target.value);
        debounceSearch(values.target.value);
    }

    useEffect(() => {
        getUsers(key);
    }, [pageSize]);

    const unActive = (id) => {
        apiUnActiveMembers(id).then((e) => {
            if (e?.status == 200) {
                if (e.data.code == '200') {
                    setPageSize({ ...pageSize });
                } else {
                    appToast({
                        toastOptions: { type: "error" },
                        description: e.data.message,
                    });
                }
            } else {
                appToast({
                    toastOptions: { type: "error" },
                    description: 'Hệ thống đang bảo trì',
                });
            }
        })
    }

    const pageChange = (newPage) => {
        setPageSize({ ...pageSize, page: newPage });
    };

    return (
        <CRow>
            <CCol lg={12}>
                <CCard>
                    <CCardHeader>
                        Danh sách thành viên
                    </CCardHeader>
                    <CCardBody>
                        <div style={{ width: "30%" }}>
                            <label className="inputTitle">Tìm kiếm</label>
                            <CInputGroup className="mb-3" style={{ display: "flex", borderRadius: 10 }}>
                                <CInput
                                    placeholder="Nhập tên tài khoản . . ."
                                    onChange={onChange}
                                    value={key}
                                />
                            </CInputGroup>
                        </div>
                        <table className="table table-hover">
                            <thead className="table-active">
                                <th>STT</th>
                                <th>
                                    {sort ?
                                        <FaSortAlphaDown onClick={() => { setSort(false); setPageSize({ ...pageSize }) }} />
                                        :
                                        <FaSortAlphaUp onClick={() => { setSort(true); setPageSize({ ...pageSize }) }} />
                                    }
                                    <span style={{ marginLeft: 10 }}>Tên tài khoản</span>
                                </th>
                                <th>Trạng thái</th>
                                <th>Khóa tài khoản</th>
                            </thead>
                            <tbody>
                                {
                                    data?.users?.map((item, index) => {
                                        return (
                                            <tr
                                                key={item.id}
                                                className={`${item.id == itemSelected?.id && "table-active"}`}
                                                onClick={() => { setItemSelected(item) }}
                                            >
                                                <td>{calcItemStart(pageSize.page, pageSize.size)}</td>
                                                <td>{item.username}</td>
                                                <td>{item.status}</td>
                                                <td>
                                                    <CButton color="secondary" onClick={() => { unActive(item.id) }}>
                                                        Khóa
                                                    </CButton>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <CPagination
                            activePage={pageSize.page}
                            onActivePageChange={pageChange}
                            pages={countPage(data?.totalItems | 1, size)}
                            align="center"
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
export default UserManager;