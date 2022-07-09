import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import SearchBox from '../components/SearchBox';
import { Grid, GridItem } from '@chakra-ui/react';
import { useContext, useEffect, useState, useReducer } from 'react';
import {
  Container,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Flex,
  Spacer,
  Text,
  Heading,
  Link,
  useToast,
  Image,
  Select,
  useColorModeValue,
  Box,
  NavItem,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast({
          title: `error`,
          status: 'error',
          isClosable: true,
        });
      }
    };
    fetchCategories();
  }, []);
  return (
    <Container maxW="80%">
      <Helmet>
        <title>Store</title>
      </Helmet>
      <Grid
        templateAreas={`"search search"
        "dep img"
        "dep body"`}
        gridTemplateRows={'50px 1fr 30px'}
        gridTemplateColumns={'150px 1fr'}
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem area={'dep'}>
          <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 40 }}
            h="full"
          >
            <Stack spacing={0} display={{ base: 'none', md: 'flex' }}>
              <Text
                fontWeight="bold"
                bg="pink"
                color="white"
                align="center"
                p="4"
                role="group"
              >
                <HamburgerIcon /> Category
              </Text>
              {categories.map((category) => (
                <Link
                  href={`/search?category=${category}`}
                  key={category}
                  align="center"
                  p="3"
                  border="1px"
                  borderColor="cyan.100"
                  cursor="pointer"
                  _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                  }}
                >
                  {category}
                </Link>
              ))}
            </Stack>
          </Box>
          {/*
          <Select>
            {categories.map((category) => {
              return (
                <option
                  onClick={() => {
                    <Link href={`/search?category=${category}`}></Link>;
                  }}
                >
                  {category}
                </option>
              );
            })}
          </Select>*/}
        </GridItem>
        <GridItem area={'search'} w="50%" mx="auto">
          <SearchBox />
        </GridItem>
        <GridItem area={'img'} maxH="50%" align="center">
          <Image src="https://res.cloudinary.com/duub1fspr/image/upload/v1656978439/bg1_uvufgv.jpg" />
        </GridItem>
        <GridItem area={'body'}>
          <Heading align="center" m="4" bg="gray.50">
            PRODUCTS
          </Heading>
          <div className="products">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <Row>
                {products.map((product) => (
                  <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </GridItem>
      </Grid>
    </Container>
  );
}
export default HomeScreen;
