import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CodeScanner from '~/components/CodeScanner';

import { styles } from './index.style';

import type { IScanResult } from '~/components/CodeScanner';

// 模拟商品数据
interface IProduct {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  requireSN: boolean;
  scannedSNs: string[];
  requiredSNCount: number;
  image?: string;
}

// 模拟订单数据
const mockProducts: IProduct[] = [
  {
    id: '1',
    name: '导向片-24*2400-方头双孔-201不锈钢小米智能门锁 E10-碳素黑-标配',
    code: 'C0354758789089',
    price: 20.0,
    quantity: 3,
    requireSN: true,
    scannedSNs: [],
    requiredSNCount: 3,
  },
  {
    id: '2',
    name: '电池组件-小米米家电动滑板车1S',
    code: 'C0354758789089',
    price: 20.0,
    quantity: 2,
    requireSN: false,
    scannedSNs: [],
    requiredSNCount: 0,
  },
];

const ScanInboundPage: React.FC = () => {
  const [torchMode, setTorchMode] = useState<'on' | 'off'>('off');
  const [products, setProducts] = useState<IProduct[]>(mockProducts);

  // 处理扫码结果 - 测试模式：允许无限录入，不检查重复和数量限制
  const handleScan = useCallback((result: IScanResult) => {
    const snCode = result.value;

    // 测试模式：直接添加到第一个需要SN的商品，不做任何限制
    setProducts((prev) => {
      const updated = [...prev];
      for (const product of updated) {
        if (product.requireSN) {
          // 直接添加，不检查重复和数量限制
          product.scannedSNs = [...product.scannedSNs, snCode];
          return updated;
        }
      }
      return prev;
    });
  }, []);

  // 处理重复扫码
  const handleDuplicateScan = useCallback((result: IScanResult) => {
    Alert.alert('提示', `该SN码已扫描过: ${result.value}`);
  }, []);

  // 手动录入
  const _handleManualInput = useCallback(() => {
    Alert.alert('手动录入', '打开手动录入界面');
  }, []);

  // 切换手电筒
  const _toggleTorch = useCallback(() => {
    setTorchMode((prev) => (prev === 'on' ? 'off' : 'on'));
  }, []);

  // 确认派发
  const handleConfirm = useCallback(() => {
    Alert.alert('确认派发', '确认派发所有商品？');
  }, []);

  // 计算总扫描进度
  const getTotalProgress = useCallback(() => {
    let total = 0;
    let scanned = 0;
    for (const p of products) {
      if (p.requireSN) {
        total += p.requiredSNCount;
        scanned += p.scannedSNs.length;
      }
    }
    return { total, scanned };
  }, [products]);

  // 渲染商品项
  const renderProductItem = (product: IProduct): React.ReactNode => {
    const isComplete = !product.requireSN || product.scannedSNs.length >= product.requiredSNCount;

    return (
      <View key={product.id} style={styles.productItem}>
        <View style={styles.productHeader}>
          <View style={styles.productImagePlaceholder}>
            {product.image ? (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>
          <View style={styles.productInfo}>
            <Text numberOfLines={2} style={styles.productName}>
              {product.name}
            </Text>
            <View style={styles.productMeta}>
              <Text style={styles.productCode}>{product.code}</Text>
              <Text style={styles.productPrice}>
                {product.requireSN ? '串号管理' : '非串号管理'}
              </Text>
              <Text style={styles.productPrice}>¥{product.price.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={styles.quantity}>x {product.quantity}</Text>
        </View>

        {product.requireSN && (
          <View style={styles.snSection}>
            <View style={styles.snHeader}>
              {isComplete ? (
                <Text style={styles.snCompleteText}>
                  ✓ 已扫描SN ({product.scannedSNs.length}/{product.requiredSNCount})
                </Text>
              ) : (
                <Text style={styles.snPendingText}>
                  ○ 待扫描SN ({product.scannedSNs.length}/{product.requiredSNCount})
                </Text>
              )}
            </View>
            {product.scannedSNs.map((sn, index) => (
              <Text key={index} style={styles.snItem}>
                SN: {sn}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const progress = getTotalProgress();

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {/* 扫码区域 */}
      <View style={styles.scannerContainer}>
        <CodeScanner
          enableDuplicateDetection
          allowDuplicateScan={false}
          cacheConfig={{
            maxSize: 100,
            expirationMs: 10 * 60 * 1000, // 10分钟
          }}
          scanInterval={1000}
          style={styles.scanner}
          torchMode={torchMode}
          onDuplicateScan={handleDuplicateScan}
          onScan={handleScan}
        />
        <Text style={styles.scanHint}>请扫描派发物品中的串码SN～</Text>
      </View>

      {/* 订单信息 */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>欧阳倩倩 ({products.length})</Text>
        <TouchableOpacity>
          <Text style={styles.orderLink}>工单 #6908 {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 商品列表 */}
      <ScrollView style={styles.productList}>{products.map(renderProductItem)}</ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={progress.scanned < progress.total}
          style={[
            styles.confirmButton,
            progress.scanned < progress.total && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>确认派发</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ScanInboundPage;
