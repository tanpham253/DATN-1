import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const color = useColorModeValue('gray.50', 'gray.800');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
          sellerName,
          sellerDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Flex align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'auto'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Create/Edit Products
            </Heading>
          </Stack>
          <Form onSubmit={submitHandler}>
            <Box rounded={'lg'} bg={color} boxShadow={'lg'} p={8}>
              <Stack spacing={4}>
                <HStack spacing={16}>
                  <Box>
                    <Form.Group id="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="name">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group id="password">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Box>
                  <Box>
                    {userInfo.isSeller && (
                      <>
                        <Heading
                          size="md"
                          pb="10"
                          align="center"
                          color="orange"
                        >
                          Seller
                        </Heading>
                        <Form.Group className="mb-3" controlId="sellerName">
                          <Form.Label>Seller Name</Form.Label>
                          <Form.Control
                            id="sellerName"
                            type="text"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="sellerDescription"
                        >
                          <Form.Label>Seller Description</Form.Label>
                          <Form.Control
                            id="sellerDescription"
                            type="text"
                            value={sellerDescription}
                            onChange={(e) =>
                              setSellerDescription(e.target.value)
                            }
                          />
                        </Form.Group>
                      </>
                    )}
                  </Box>
                </HStack>
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    disabled={loadingUpdate}
                    type="submit"
                  >
                    Update
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Form>
        </Stack>
      </Flex>
    </div>
  );
}
