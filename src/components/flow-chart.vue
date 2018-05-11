<template>
  <el-container>
    <el-aside width="200px">
      <div class="title">生产元素</div>
      <el-input v-model="search"
                suffix-icon="el-icon-search"
                size="mini"
                class="search"
                placeholder="请输入"></el-input>
      <el-tree :data="models"
               node-key="id"
               class="model-container"
               default-expand-all>
        <div slot-scope="{ node, data }" :id="`drag-model-${data.id}`">
          <i v-if="data.type === TYPE_FOLDER" class="el-icon-tickets folder"></i>
          <i v-else-if="data.type === TYPE_PROCESS" class="el-icon-setting process"></i>
          <i v-else-if="data.type === TYPE_HR" class="el-icon-star-on hr"></i>
          <span>&nbsp;{{ node.label }}</span>
        </div>
      </el-tree>
      <el-button @click="saveCanvas">保存图片</el-button>
      <el-button @click="saveData">保存数据</el-button>
      <el-dialog title="编辑流程"
                 width="560px"
                 :visible.sync="isDetailOpen">
        <el-form :model="editingNode"
                 ref="form"
                 :rules="rules"
                 label-width="80">
          <el-form-item label="生产步骤：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingNode && editingNode.treeNodeId">
              <el-option v-for="item in types"
                         :key="item.id"
                         :label="item.label"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <div style="border-top: 1px solid #EEE; margin: 8px"></div>

          <el-form-item label="底板型号：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingNode && editingNode.floorType"
                       placeholder="请选择"></el-select>
          </el-form-item>

          <el-form-item label="物料型号：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingNode && editingNode.materialModel"
                       placeholder="请选择"></el-select>
          </el-form-item>

          <el-form-item label="装配精度：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingNode && editingNode.assemblyAccurancy"
                       placeholder="请选择"></el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isDetailOpen = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑工序"
                 width="560px"
                 :visible.sync="isProcessOpen">
        <el-form :model="editingEdge"
                 ref="form"
                 :rules="rules"
                 label-width="80">
          <el-form-item label="选择工序：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingEdge && editingEdge.labelText">
              <el-option v-for="item in edges"
                         :key="item.id"
                         :label="item.labelText"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <div style=" border-top: 1px solid #EEE; margin: 8px"></div>

          <el-form-item label="底板型号：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingEdge && editingEdge.floorType"
                       placeholder="请选择"></el-select>
          </el-form-item>

          <el-form-item label="物料型号：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingEdge && editingEdge.materialModel"
                       placeholder="请选择"></el-select>
          </el-form-item>

          <el-form-item label="装配精度：">
            <!--eslint-disable-next-line vue/valid-v-model-->
            <el-select v-model="editingEdge && editingEdge.assemblyAccurancy"
                       placeholder="请选择"></el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isProcessOpen = false">取 消</el-button>
          <el-button type="primary" @click="saveEdge">确 定</el-button>
        </div>
      </el-dialog>

    </el-aside>

    <el-main class="drag-jsplumb-main">
      <div id="main-panel" ref="jsplumbContent">
        <div v-for="node in nodes"
             class="node"
             :key="node.id"
             :id="node.id"
             :style="node.style">
          <el-popover placement="bottom"
                      width="80"
                      :visible-arrow="false"
                      trigger="click">
            <el-menu class="popover-edit-menu">
              <el-menu-item index="edit"
                            @click="edit(node.id)">编辑</el-menu-item>
              <el-menu-item index="delete"
                            @click="removeNode(node.id)"
                            class="delete">删除</el-menu-item>
            </el-menu>

            <el-button type="primary"
                       size="small"
                       slot="reference"
                       v-if="node.type === TYPE_PROCESS">
              {{getText(node)}}&nbsp;&nbsp;<i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button type="danger"
                       size="small"
                       slot="reference"
                       v-if="node.type === TYPE_HR">
              {{getText(node)}}&nbsp;&nbsp;<i class="el-icon-arrow-down"></i>
            </el-button>
          </el-popover>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { jsPlumb } from 'jsplumb'
// import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image'
import flowData from '../api/module'

// 配置连接点
const DynamicAnchors = ['Left', 'Right', 'Top', 'Bottom']

const connectorStyle = {
  stroke: '#7AB02C', strokeWidth: 2, joinstyle: 'round' }

const connectorHoverStyle = { stroke: '#5c96bc', strokeWidth: 3 }

const endpointStyle = {
  fill: 'transparent', stroke: '#7AB02C', radius: 4, strokeWidth: 1 }

const endpointHoverStyle = {
  fill: '#5c96bc', stroke: '#5c96bc', radius: 4, strokeWidth: 1 }

const TYPE_FOLDER = 'folder'

const TYPE_PROCESS = 'process'

const TYPE_HR = 'hr'

const Common = {
  anchor: 'AutoDefault',
  connector: 'Flowchart',
  endpoint: 'Dot',
  paintStyle: connectorStyle,
  hoverPaintStyle: connectorHoverStyle,
  endpointStyle,
  endpointHoverStyle
}

export default {
  name: 'DragJsPlumb',
  data () {
    return {
      TYPE_FOLDER,
      TYPE_PROCESS,
      TYPE_HR,
      models: [
        {
          id: 100,
          label: '生产步骤',
          type: TYPE_FOLDER,
          children: [
            {id: 101, type: TYPE_PROCESS, label: '插零件'},
            {id: 102, type: TYPE_PROCESS, label: '波峰焊'},
            {id: 103, type: TYPE_PROCESS, label: '执锡'},
            {id: 104, type: TYPE_PROCESS, label: '剪脚'},
            {id: 105, type: TYPE_PROCESS, label: 'ICT测试'},
            {id: 106, type: TYPE_PROCESS, label: '装配'},
            {id: 107, type: TYPE_PROCESS, label: '质检'},
            {id: 108, type: TYPE_PROCESS, label: '装箱'}
          ]
        },
        {
          id: 200,
          label: '人力资源',
          type: TYPE_FOLDER,
          children: [
            {id: 201, type: TYPE_HR, label: '插线员'},
            {id: 202, type: TYPE_HR, label: '机械员'},
            {id: 203, type: TYPE_HR, label: '焊接员'},
            {id: 204, type: TYPE_HR, label: '剪脚员'},
            {id: 205, type: TYPE_HR, label: '测试员'},
            {id: 206, type: TYPE_HR, label: '质检员'},
            {id: 207, type: TYPE_HR, label: '装箱员'}
          ]
        }
      ],
      search: null,
      isDetailOpen: false,
      rules: {},
      nodes: [], // 右侧主体栏的节点
      edges: [],
      dragModelNode: null, // 正在拖拽的元素
      editingNode: null,
      isProcessOpen: false,
      editingEdge: null,
      info: null,
      modelInstance: jsPlumb.getInstance({
        container: 'model-container'
      }),
      mainInstance: jsPlumb.getInstance({
        // Container: 'main-panel',
        ConnectionOverlays: [
          ['Arrow', { location: 1, id: 'arrow', width: 11, length: 11 }],
          ['Label',
            {
              location: 0.3,
              id: 'label',
              label: 'asdadsa',
              cssClass: 'edge-label',
              events: {click: this.editProcess}
            }
          ]
        ]
      }),
      anEndpoint: {
        connector: 'Flowchart',
        endpoint: 'Dot',
        isSource: true,
        isTarget: true,
        paintStyle: endpointStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorStyle: connectorStyle,
        connectorHoverStyle: connectorHoverStyle,
        dropOptions: { drop: this.handleDrop }
      }
    }
  },
  computed: {
    types () {
      let result = []
      if (this.dragTreeNode) {
        this.tree.forEach(branch => {
          branch.children.forEach(leaf => {
            if (leaf.type === this.dragTreeNode.type) {
              result.push(leaf)
            }
          }, this)
        }, this)
      }
      return result
    }
  },
  mounted () {
    // 初始化左边模型栏可拖拽
    let modelDragEls = []
    this.models.forEach(branch => {
      branch.children.forEach(leaf => {
        modelDragEls.push(`drag-model-${leaf.id}`)
      }, this)
    }, this)
    this.modelInstance.draggable(modelDragEls, { clone: true })
    // 初始化左边模型栏可放置在右边内容栏，放置前调用回调函数
    this.modelInstance.droppable('main-panel', { drop: this.drop })
    // ？？建立连线
    this.mainInstance.bind('beforeDrop', this.beforeDrop)
    console.log(flowData)
    // this.renderData(flowData)
  },
  methods: {
    saveCanvas () {
      // toSvg 有个dataUrl，svg没有缩放的尺寸问题，github没找到解决方法，解决可能需要修改一小部分源码
      domtoimage.toSvg(document.querySelector('#main-panel'))
        .then(function (dataUrl) {
          let img = new Image(100, 200)
          img.src = dataUrl
          console.log(dataUrl)
          document.body.appendChild(img)
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
      // toPng和toJpeg精度较低,图片失真,，保证精度需要使用tosvg，border截图问题
      /**
        domtoimage.toPng(document.querySelector('#main-panel'), {})
          .then(function (dataUrl) {
            let img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });
        // html2canvas 需要 canvg才能截图生成canvas，需要节点中所有移除svg并替换为canvas
        html2canvas(document.querySelector('#main-panel')).then(canvas => {
          document.body.appendChild(canvas);
        });
        **/
    },
    getText (node) {
      console.log(node)
      let treeNode = this.findModelNode(node.treeNodeId)
      if (treeNode) {
        return treeNode.label
      }
    },
    findModelNode (modelId) {
      for (let branch of this.models) {
        for (let leaf of branch.children) {
          if (leaf.id === parseInt(modelId, 10)) {
            return leaf
          }
        }
      }
      return null
    },
    saveEdit () {
      let id = this.editingNode.id
      let i = this.nodes.findIndex(node => node.id === id)
      this.nodes[i] = this.editingNode
      this.editingNode = null
      this.isDetailOpen = false
    },
    saveEdge () {
      console.log('saveEdge')
      let index = this.edges.findIndex(e => e.id === this.editingEdge.id)
      this.edges[index] = this.editingNode
      this.editingEdge = null
      this.isProcessOpen = false
    },
    edit (id) {
      this.editingNode = this.nodes.find(node => node.id === id)
      this.isDetailOpen = true
    },
    editProcess (info) {
      console.log(info)
      this.editingEdge = this.edges.find(edge => (
        edge.source === info.component.sourceId &&
          edge.target === info.component.targetId
      ))
      this.isProcessOpen = true
    },
    removeNode (id) {
      this.$confirm('确认删除当前节点？')
        .then(() => {
          this.mainInstance.remove(id + '')
          let index = this.nodes.findIndex(node => node.id === id)
          console.log(index)
          this.nodes.splice(index, 1)
        })
        .catch(() => {})
    },
    handleDrop (e) {
    },
    beforeDrop (info) {
      console.log(info)
      // 两个元素之间建立连接
      let labelText = `工序${this.edges.length + 1}`
      let edge = {
        id: this.edges.length + 1,
        source: info.connection.endpoints
          ? info.connection.endpoints : info.sourceId,
        target: info.dropEndpoint,
        labelText: labelText
      }
      console.log(edge)
      this.edges.push(edge)
      let c = this.mainInstance.connect(edge, Common)
      this.$nextTick(_ => c.getOverlay('label').setLabel(labelText))
    },
    drop (info) {
      console.log(info)
      // 找到正在拖拽的元素
      this.dragModelNode = this.findModelNode(
        info.drag.el.id.split('drag-model-')[1])
      // 创建元素数据放置到node中
      this.nodes.push(this.createNode(info))
      // 下次DOM更新完成后渲染新的node和addEntPoint
      this.$nextTick(() => this.renderNode(
        this.nodes[this.nodes.length - 1]))
    },
    createNode (info) {
      console.log(info)
      // 生成新node的身份信息
      let nodeObj
      let left = info.e.clientX - info.e.offsetX -
          this.$refs.jsplumbContent.offsetLeft + 'px'
      let top = info.e.clientY - info.e.offsetY + 'px'
      // 此处应该有个判断边界
      nodeObj = {
        id: `item-id-${this.nodes.length + 1}`,
        treeNodeId: this.dragModelNode.id,
        type: this.dragModelNode.type,
        style: {
          left: left,
          top: top,
          position: 'absolute'
        }
      }

      console.log(nodeObj)

      return nodeObj
    },
    renderNode (node) {
      console.log(node)
      this.mainInstance.draggable(node.id, { containment: true })
      DynamicAnchors
        .map(anchor => this.mainInstance
          .addEndpoint(node.id, this.anEndpoint, { anchor: anchor }))
      this.mainInstance.makeTarget(node.id)
    },
    renderData (data) {
      this.nodes = data.nodes
      this.edges = data.edges
      console.log(this.edges)
      this.$nextTick(() => {
        if (this.nodes && this.nodes.length > 0) {
          console.log(this.nodes)
          this.nodes.map(node => this.renderNode(node))
        }
        if (this.edges && this.edges.length > 0) {
          this.edges.map(edge => this.mainInstance
            .connect(edge, Common)
            .getOverlay('label')
            .setLabel(edge.labelText)
          )
        }
      })
    },
    saveData () {
      // let data = {}
      // data.nodes = this.nodes
      // data.edges = this.edges
      // console.log(data)
      console.log(this.nodes)
    }
  }
}
</script>

<style scoped>
  .node {
    padding: 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }

  .drag-jsplumb-main {
    margin: 16px;
    background-color: #FFFFFF;
  }

  .folder {
    color: #5D5D5D;
  }

  .process {
    color: #389FFE;
  }

  .hr {
    color: #FF908E;
  }

  #main-panel{
    position: relative;
    border-radius: 10px;
    border:1px solid #e1e5e6;
    box-sizing: border-box;
  };

  .el-container {
    min-height: 640px;
  }

  .el-aside {
    background-color: #FFFFFF;
  }

  .title {
    line-height: 20px;
    height: 20px;
    text-align: left;
    padding-left: 16px;
    padding-top: 16px;
  }

  .search {
    margin: 8px 0;
  }

  #main-panel {
    height: 100%;
    width: 100%;
  }

  .el-main {
    padding: 0;
  }

  .delete {
    color: red;
  }
</style>
