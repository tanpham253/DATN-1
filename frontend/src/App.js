/* eslint-disable no-lone-blocks */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState, ReactNode } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  {
    /*Action User_signout tới local xóa userinfo(token) và cart lưu trong local store.js*/
  }
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />
      <>
        <Box bg="gray.900" px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <HStack spacing={8} alignItems={'center'}>
              <Box m="auto">
                <Link
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.700'),
                    textColor: 'cyan.400',
                  }}
                  href={'/'}
                  textColor="white"
                >
                  STORE
                </Link>
              </Box>
            </HStack>
            <Flex alignItems={'center'}>
              <Link
                href="/cart"
                _hover={{
                  textDecoration: 'none',
                }}
              >
                <Button
                  variant={'solid'}
                  colorScheme={'teal'}
                  size={'sm'}
                  mr={4}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </Link>
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}
              >
                {userInfo ? (
                  <Menu>
                    <MenuButton
                      px={2}
                      py={1}
                      rounded={'md'}
                      _hover={{
                        textDecoration: 'none',
                        bg: 'gray.700',
                        textColor: 'cyan.400',
                      }}
                      href={'/'}
                      textColor="white"
                    >
                      {userInfo.name}
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/profile"
                      >
                        User Profile
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/orderhistory"
                      >
                        Order History
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <Link
                    href="/signin"
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: 'gray.700',
                      textColor: 'cyan.400',
                    }}
                    textColor="white"
                  >
                    Sign In
                  </Link>
                )}
                {userInfo && userInfo.isSeller && (
                  <Menu>
                    <MenuButton
                      px={2}
                      py={1}
                      rounded={'md'}
                      _hover={{
                        textDecoration: 'none',
                        bg: 'gray.700',
                        textColor: 'cyan.400',
                      }}
                      href={'/'}
                      textColor="yellow"
                    >
                      Seller
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/seller/products"
                      >
                        Products
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/seller/orders"
                      >
                        Orders
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
                {userInfo && userInfo.isAdmin && (
                  <Menu>
                    <MenuButton
                      px={2}
                      py={1}
                      rounded={'md'}
                      _hover={{
                        textDecoration: 'none',
                        bg: 'gray.700',
                        textColor: 'cyan.400',
                      }}
                      href={'/'}
                      textColor="red"
                    >
                      Admin
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/admin/products"
                      >
                        Products
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/admin/orders"
                      >
                        Orders
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        _hover={{
                          textDecoration: 'none',
                        }}
                        href="/admin/users"
                      >
                        Users
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </HStack>
            </Flex>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
        </Box>
      </>
      <main className="mt-3">
        <div>
          <Routes>
            <Route path="/seller/:id" element={<SellerScreen />}></Route>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/seller/product/:id"
              element={
                <SellerRoute>
                  <ProductEditScreen />
                </SellerRoute>
              }
            ></Route>
            <Route
              path="/seller/products"
              element={
                <SellerRoute>
                  <ProductListScreen />
                </SellerRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <SellerRoute>
                  <OrderListScreen />
                </SellerRoute>
              }
            />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
